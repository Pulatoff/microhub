const axios = require('axios')
const multer = require('multer')
const crypto = require('crypto')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { PutObjectCommand, GetObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3')
// configs
const { SPOONACULAR_API_URL, SPOONACULAR_API_KEY } = require('../configs/URL')
const s3Client = require('../configs/s3Client')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const AppError = require('../utils/AppError')
// models
const Trainer = require('../models/personalTrainerModel')
const Recipe = require('../models/recipeModel')
const Ingredient = require('../models/ingredientModel')
const Consumer = require('../models/consumerModel')

const storage = multer.memoryStorage()

exports.upload = multer({ storage })

exports.searchRecipes = CatchError(async (req, res, next) => {
    let { search, number, offset } = req.query
    number = number || 1
    offset = offset || 0
    const results = await axios.get(
        `${SPOONACULAR_API_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${search}&addRecipeNutrition=true&number=${number}&offset=${offset}`
    )
    if (results.statusText !== 'OK') next(new AppError('Bad request', 400))
    if (!results?.data) next(new AppError('recipes not found', 400))
    const recipes = []
    results.data.results.forEach((val) => {
        const macros = { cals: 0, fat: 0, carbs: 0, protein: 0 }
        val.nutrition.nutrients.map((value) => {
            if (value.name.toLowerCase() === 'fat') {
                macros.fat = value.amount
            } else if (value.name.toLowerCase() === 'protein') {
                macros.protein = value.amount
            } else if (value.name.toLowerCase() === 'calories') {
                macros.cals = value.amount
            } else if (value.name.toLowerCase() === 'carbohydrates') {
                macros.carbs = value.amount
            }
        })

        const recipe = {
            name: val.title,
            imageUrl: val.image,
            ...macros,
            method: null,
            isSaved: 0,
        }
        recipes.push(recipe)
    })
    response(200, 'You successfuly recieved recipes', true, { results: recipes }, res)
})

exports.getOneRecipe = CatchError(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const recipe = await Recipe.findByPk(id, {
        attributes: { exclude: ['nutritionistId'] },
        where: { nutritionistId: trainer.id },
    })
    response(200, 'You get one recipe', true, { recipe }, res)
})

exports.subsituteIngredients = CatchError(async (req, res, next) => {
    // igredient id
    const { ingredientName } = req.query
    const responseData = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/substitutes/?apiKey=${SPOONACULAR_API_KEY}&ingredientName=${ingredientName}`
    )

    const data = responseData.data
    if (data.substitutes) {
        data.substitutes = ingredientFunc(data.substitutes)
    }
    response(200, data?.message, true, { ingredient: data.ingredient, substitutes: data.substitutes }, res)
})

exports.getIngredientInfo = CatchError(async (req, res, next) => {
    // ingredient id
    const { id } = req.params
    let { amount, unit } = req.query
    amount = amount || 1
    unit = unit || 'g'
    const responseData = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/${id}/information/?apiKey=${SPOONACULAR_API_KEY}&amount=${amount}&unit=${unit}`
    )

    const data = responseData.data
    const nutrients = data.nutrition.nutrients.filter((val) => {
        if (
            val.name.toLowerCase() === 'fat' ||
            val.name.toLowerCase() === 'protein' ||
            val.name.toLowerCase() === 'calories' ||
            val.name.toLowerCase() === 'carbohydrates'
        ) {
            return val
        }
    })
    const ingredient = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        unit: data.unit,
        possibleUnits: data.possibleUnits,
        image: data.image,
        nutrients,
    }

    response(200, 'successfully geted inforomation' + data.original, true, { ingredient }, res)
})

exports.searchIngredients = CatchError(async (req, res, next) => {
    let { query, number, offset, amount } = req.query
    offset = offset || 0
    number = number || 2
    amount = amount || process.env.DEFAULT_AMOUNT_OF_MEALS
    const unit = process.env.DEFAULT_UNIT_OF_MEALS

    const ingredients = []

    const data = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/search?metaInformation=true&offset=${offset}&number=${number}&query=${query}&apiKey=${SPOONACULAR_API_KEY}`
    )
    console.log(data.data.results.length)
    for (let i = 0; i < data?.data.results.length; i++) {
        const ingredient = data.data.results[i]
        const resp = await axios.get(
            `${SPOONACULAR_API_URL}/food/ingredients/${ingredient.id}/information?amount=${amount}&unit=${unit}&apiKey=${SPOONACULAR_API_KEY}`
        )
        const macros = { cals: 0, carbs: 0, protein: 0, fat: 0 }
        resp.data.nutrition.nutrients.map((val) => {
            if (val.name.toLowerCase() === 'fat') {
                macros.fat = val.amount
            } else if (val.name.toLowerCase() === 'protein') {
                macros.protein = val.amount
            } else if (val.name.toLowerCase() === 'calories') {
                macros.cals = val.amount
            } else if (val.name.toLowerCase() === 'carbohydrates') {
                macros.carbs = val.amount
            }
        })
        ingredients.push({
            spoon_id: resp.data.id,
            name: resp.data.name,
            amount: resp.data.amount,
            unit: resp.data.unit,
            possibleUnits: resp.data.possibleUnits,
            image: 'https://spoonacular.com/cdn/ingredients_500x500/' + resp.data.image,
            ...macros,
        })
    }
    response(200, 'You are successfully got data', true, { ingredients }, res)
})

exports.addRecipe = CatchError(async (req, res, next) => {
    const userId = req.user.id
    let ingredients = req.body.ingredients

    const filename = crypto.randomUUID()
    if (req.file) {
        await s3Client.send(
            new PutObjectCommand({
                Key: filename,
                Bucket: process.env.DO_SPACE_BUCKET,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            })
        )
    }

    const imageUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({ Key: filename, Bucket: process.env.DO_SPACE_BUCKET }),
        { expiresIn: 3600 * 24 }
    )
    if (typeof ingredients === 'string') {
        ingredients = JSON.parse(ingredients)
    }
    ingredients = ingredients.map((val) => {
        const { spoon_id, name, amount, unit, protein, fat, cals, carbs, image } = val
        if (!spoon_id || !name || !amount || !unit) next(new AppError(`You need enter all field ingredient`, 404))
        return { spoon_id, name, amount, unit, protein, fat, cals, carbs, image }
    })

    const trainer = await Trainer.findOne({ where: { userId } })
    const consumer = await Consumer.findOne({ where: { userId } })

    const recipe = await Recipe.create({
        ...req.body,
        imageUrl: req.body.image_url ? undefined : imageUrl,
        nutritionistId: req.user.role == 'nutritionist' ? trainer?.id : null,
        ingredients,
        consumerId: req.user.role == 'consumer' ? consumer?.id : null,
    })

    for (let i = 0; i < ingredients.length; i++) {
        const { spoon_id, name, amount, unit, protein, fat, cals, carbs, image } = ingredients[i]
        await Ingredient.create({ spoon_id, name, amount, unit, cals, carbs, protein, fat, recipeId: recipe.id, image })
    }

    response(200, 'You are successfully created recipe', true, '', res)
})

exports.getAllRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.role === 'nutritionist' ? req.user.id : 1
    const trainer = await Trainer.findOne({ where: { userId }, attributes: { exclude: ['nutritionistId'] } })

    const recipes = await Recipe.findAll({
        where: { nutritionistId: trainer.id },
        attributes: { exclude: ['nutritionistId'] },
        include: [{ model: Ingredient }],
    })

    response(200, 'You are successfully get recipes', true, { recipes }, res)
})

exports.updateRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id
    const { name, fat, protein, calories, method } = req.body

    const trainer = await Trainer.findOne({ where: { userId } })
    const recipe = await Recipe.findByPk(id, { where: { nutritionistId: trainer.id } })
    recipe.name = name || recipe.name
    recipe.fat = fat || recipe.fat
    recipe.cals = calories || recipe.calories
    recipe.protein = protein || recipe.protein
    recipe.method = method || recipe.method

    await recipe.save()

    response(200, `You are successfully update recipe by id ${id}`, true, '', res)
})

exports.deleteRecipe = CatchError(async (req, res, next) => {
    const { id } = req.params
    await Recipe.destroy({ where: { id }, truncate: false })
    response(200, 'You are successfully delete user', true, '', res)
})

exports.randomRecipes = CatchError(async (req, res, next) => {
    let { number } = req.query
    number = number || 1
    const resp = await axios.get(
        `${SPOONACULAR_API_URL}/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=${number}&includeNutrition=true`
    )
    // const resipes = []
    // resp.data.recipes.forEach((val) => {
    //     const recipe = {
    //         id: null,
    //         name: val.sourceName,
    //         imageUrl: val.sourceUrl,
    //         cals: val.as,
    //     }
    // })
    response(200, `You get random ${resp.data.length} recipes`, true, { recipes }, res)
})

exports.getConsumerRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })
    const recipes = await Recipe.findAll({
        where: { consumerId: consumer.id },
        include: [{ model: Ingredient }],
    })
    response(200, `You are successfully get recipes`, true, { recipes }, res)
})
