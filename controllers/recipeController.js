const axios = require('axios')
// configs
const { SPOONACULAR_API_URL, SPOONACULAR_API_KEY } = require('../configs/URL')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const AppError = require('../utils/AppError')
// models
const Trainer = require('../models/personalTrainerModel')
const Recipe = require('../models/recipeModel')
const Ingredient = require('../models/ingredientModel')

exports.searchRecipes = CatchError(async (req, res, next) => {
    let { search, number, offset } = req.query
    number = number || 1
    offset = offset || 0
    const results = await axios.get(
        `${SPOONACULAR_API_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${search}&addRecipeNutrition=true&number=${number}&offset=${offset}`
    )
    if (results.statusText !== 'OK') next(new AppError('Bad request', 400))
    response(200, 'You successfuly recieved recipes', true, results?.data, res)
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
    let { query, number, offset, unit, amount } = req.query
    offset = offset || 0
    number = number || 1
    amount = amount || 1
    unit = unit || 'g'

    const ingredients = []

    const data = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/search?metaInformation=true&offset=${offset}&number=${number}&query=${query}&apiKey=${SPOONACULAR_API_KEY}`
    )
    for (let i = 0; i < data?.data.results.length; i++) {
        const ingredient = data.data.results[i]
        const resp = await axios.get(
            `${SPOONACULAR_API_URL}/food/ingredients/${ingredient.id}/information?amount=${amount}&unit=${unit}&apiKey=${SPOONACULAR_API_KEY}`
        )
        const nutrients = []
        resp.data.nutrition.nutrients.map((val) => {
            if (
                val.name.toLowerCase() === 'fat' ||
                val.name.toLowerCase() === 'protein' ||
                val.name.toLowerCase() === 'calories' ||
                val.name.toLowerCase() === 'carbohydrates'
            ) {
                nutrients.push(val)
            }
        })
        ingredients.push({
            id: resp.data.id,
            name: resp.data.name,
            amount: resp.data.amount,
            unit: resp.data.unit,
            possibleUnits: resp.data.possibleUnits,
            image: resp.data.image,
            nutrients,
        })
    }
    response(200, 'You are successfully got data', true, { ingredients }, res)
})

exports.addRecipe = CatchError(async (req, res, next) => {
    const userId = req.user.id
    let ingredients = req.body.ingredients

    ingredients = ingredients.map((val) => {
        const { spoon_id, name, amount, unit, protein, fat, cals, carbs, image } = val
        if (!spoon_id || !name || !amount || !unit) next(new AppError(`You need enter all field ingredient`, 404))
        return { spoon_id, name, amount, unit, protein, fat, cals, carbs, image }
    })

    const trainer = await Trainer.findOne({ where: { userId } })

    const recipe = await Recipe.create({ ...req.body, nutritionistId: trainer.id, ingredients })
    for (let i = 0; i < ingredients.length; i++) {
        const { spoon_id, name, amount, unit, protein, fat, cals, carbs, image } = ingredients[i]

        await Ingredient.create({ spoon_id, name, amount, unit, cals, carbs, protein, fat, recipeId: recipe.id, image })
    }
    response(200, 'You are successfully created recipe', true, '', res)
})

exports.getAllRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId }, attributes: { exclude: ['nutritionistId'] } })
    const recipes = await Recipe.findAll({
        where: { nutritionistId: trainer.id },
        attributes: { exclude: ['nutritionistId'] },
    })
    response(200, 'You are successfully get recipes', true, { recipes }, res)
})

exports.updateRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id
    const { name, fat, protein, calories, carbohydrates, proteinPercentage, fatPercentage, carbohydratesPercentage } =
        req.body

    const trainer = await Trainer.findOne({ where: { userId } })
    const recipe = await Recipe.findByPk(id, { where: { nutritionistId: trainer.id } })
    recipe.name = name || recipe.name
    recipe.fat = fat || recipe.fat
    recipe.calories = calories || recipe.calories
    recipe.carbohydrates = carbohydrates || recipe.carbohydrates
    recipe.carbohydratesPercentage = carbohydratesPercentage || recipe.carbohydratesPercentage
    recipe.protein = protein || recipe.protein
    recipe.fatPercentage = fatPercentage || recipe.fatPercentage
    recipe.proteinPercentage = proteinPercentage || recipe.proteinPercentage

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

    response(200, `You get random ${resp.data.length} recipes`, true, { recipes: resp.data }, res)
})
