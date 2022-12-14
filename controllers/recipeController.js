const axios = require('axios')
// configs
const { SPOONACULAR_API_URL, SPOONACULAR_API_KEY } = require('../configs/URL')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const AppError = require('../utils/AppError')
// models
const Trainer = require('../models/personalTrainerModel')
const Recipes = require('../models/recipeModel')

exports.ssearchRecipes = CatchError(async (req, res, next) => {
    let { search, number } = req.query
    number = number || 1
    const results = await axios.get(
        SPOONACULAR_API_URL +
            '/recipes/complexSearch?apiKey=' +
            SPOONACULAR_API_KEY +
            '&query=' +
            search +
            '&addRecipeNutrition=true&number=' +
            number
    )
    if (results.statusText !== 'OK') next(new AppError('Bad request', 400))
    response(200, 'You successfuly recieved recipes', true, results?.data, res)
})

exports.getOneRecipe = CatchError(async (req, res, next) => {
    const { id } = req.params
    const recipe = await Recipes.findByPk(id)
    response(200, 'You get one recipe', true, { recipe }, res)
})

exports.subsituteIngredients = CatchError(async (req, res, next) => {
    // igredient id
    const { ingredientName } = req.query
    const responseData = await axios.get(
        SPOONACULAR_API_URL +
            '/food/ingredients/substitutes/?apiKey=' +
            SPOONACULAR_API_KEY +
            '&ingredientName=' +
            ingredientName
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
    const { grams } = req.query
    const responseData = await axios.get(
        SPOONACULAR_API_URL +
            '/food/ingredients/' +
            id +
            '/information/?apiKey=' +
            SPOONACULAR_API_KEY +
            '&amount=' +
            grams +
            '&unit=grams'
    )
    const data = responseData.data
    response(200, 'successfully geted inforomation' + data.original, true, { data }, res)
})

exports.searchIngredients = CatchError(async (req, res, next) => {
    const { query } = req.query
    // /food/ingredients/${food.id}/information?amount=1&apiKey=${process.env.API_KEY}
    const data = await axios.get(
        SPOONACULAR_API_URL +
            '/food/ingredients/search?metaInformation=true&offset=0&number=10&query=' +
            query +
            '&apiKey=' +
            SPOONACULAR_API_KEY
    )

    response(200, 'You are successfully got data', true, { ingridients: data?.data }, res)
})

exports.addRecipe = CatchError(async (req, res, next) => {
    const userId = req.user.id

    const trainer = await Trainer.findOne({ where: { userId } })
    await Recipes.create({
        ...req.body,
        nutritionistId: trainer.id,
    })
    response(200, 'You are successfully created recipe', true, '', res)
})

exports.getAllRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId }, attributes: { exclude: ['nutritionistId'] } })
    const recipes = await Recipes.findAll({ where: { nutritionistId: trainer.id } })
    response(200, 'You are successfully get recipes', true, { recipes }, res)
})

exports.updateRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id
    const { name, fat, protein, calories, carbohydrates, proteinPercentage, fatPercentage, carbohydratesPercentage } =
        req.body

    const trainer = await Trainer.findOne({ where: { userId } })
    const recipe = await Recipes.findByPk(id, { where: { nutritionistId: trainer.id } })
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
    await Recipes.destroy(id)
    response(200, 'You are successfully delete user', true, '', res)
})

// 1 cup = 1 cup tomato sauce + 1 tsp vinegar + 1 tbsp sugar
// 1 cup = 1 cup margarine
// 1 cup = 1 tbsp lemon juice or vinegar + enough milk to make 1 cup
// 1 cup = 7/8 cup shortening and 1/2 tsp salt

// function ingredientFunc(array) {
//     const subIngredients = []
//     console.log(array)
//     for (let i = 0; i < array.length; i++) {
//         console.log(array[i])
//         let sub_ingredients = array[i].split('=')[1].split(' ')
//         const num_plyus = sub_ingredients.indexOf('+')
//         console.log(num_plyus)
//         let ingredient = sub_ingredients.slice(3, num_plyus !== -1 ? num_plyus : 4).join(' ')
//         // for (let k = 0; k < sub_ingredients; k++) {}

//         subIngredients.push({ name: ingredient, amount: sub_ingredients[1] })
//     }
//     return subIngredients
// }
