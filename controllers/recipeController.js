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
    const recipe = await Recipe.findByPk(id)
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
    let { grams, unit } = req.query
    grams = grams || 100
    unit = unit || 'grams'
    const responseData = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/${id}/information/?apiKey=${SPOONACULAR_API_KEY}&amount=${grams}&unit=${unit}`
    )
    const data = responseData.data
    response(200, 'successfully geted inforomation' + data.original, true, { data }, res)
})

exports.searchIngredients = CatchError(async (req, res, next) => {
    let { query, number, offset, unit } = req.query
    offset = offset || 0
    number = number || 1
    unit = unit || 'oz'

    const ingredients = []

    const data = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/search?metaInformation=true&offset=${offset}&number=${number}&query=${query}&apiKey=${SPOONACULAR_API_KEY}`
    )
    for (let i = 0; i < data?.data.results.length; i++) {
        const ingredient = data.data.results[i]
        const resp = await axios.get(
            `${SPOONACULAR_API_URL}/food/ingredients/${ingredient.id}/information?amount=1&unit=${ingredient.possibleUnits[0]}&apiKey=${SPOONACULAR_API_KEY}`
        )

        ingredients.push({
            id: resp.data.id,
            name: resp.data.name,
            amount: resp.data.amount,
            unit: resp.data.unit,
            possibleUnits: resp.data.possibleUnits,
            image: resp.data.image,
            nutrients: [
                resp.data.nutrition.nutrients[12],
                resp.data.nutrition.nutrients[18],
                resp.data.nutrition.nutrients[24],
                resp.data.nutrition.nutrients[29],
            ],
        })
    }
    response(200, 'You are successfully got data', true, { ingredients }, res)
})

exports.addRecipe = CatchError(async (req, res, next) => {
    const userId = req.user.id
    let ingredients = req.body.ingredients

    ingredients = ingredients.map((val) => {
        const { id, name, amount, unit, nutrients } = val
        if (!id || !name || !amount || !unit || !nutrients)
            next(new AppError(`You need enter all field ingredient`, 404))
        return { id, name, amount, unit, nutrients }
    })

    const trainer = await Trainer.findOne({ where: { userId } })
    await Recipe.create({ ...req.body, nutritionistId: trainer.id, ingredients })

    response(200, 'You are successfully created recipe', true, '', res)
})

exports.getAllRecipes = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId }, attributes: { exclude: ['nutritionistId'] } })
    const recipes = await Recipe.findAll({ where: { nutritionistId: trainer.id } })
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
    await Recipe.destroy(id)
    response(200, 'You are successfully delete user', true, '', res)
})

const ingredient = [
    {
        id: 1230,
        original: 'butter milk',
        originalName: 'butter milk',
        name: 'butter milk',
        amount: 1,
        unit: 'g',
        unitShort: 'g',
        unitLong: 'gram',
        possibleUnits: ['g', 'oz', 'teaspoon', 'cup', 'tablespoon'],
        estimatedCost: {
            value: 0.2,
            unit: 'US Cents',
        },
        consistency: 'solid',
        aisle: 'Milk, Eggs, Other Dairy',
        image: 'buttermilk.jpg',
        meta: [],
        nutrition: {
            nutrients: [
                {
                    name: 'Choline',
                    amount: 0.15,
                    unit: 'mg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Folate',
                    amount: 0.05,
                    unit: 'µg',
                    percentOfDailyNeeds: 0.01,
                },
                {
                    name: 'Sugar',
                    amount: 0.05,
                    unit: 'g',
                    percentOfDailyNeeds: 0.05,
                },
                {
                    name: 'Vitamin E',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Magnesium',
                    amount: 0.1,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.03,
                },
                {
                    name: 'Calcium',
                    amount: 1.15,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.12,
                },
                {
                    name: 'Phosphorus',
                    amount: 0.85,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.09,
                },
                {
                    name: 'Vitamin B6',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.02,
                },
                {
                    name: 'Manganese',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Lycopene',
                    amount: 0,
                    unit: 'µg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Vitamin B12',
                    amount: 0,
                    unit: 'µg',
                    percentOfDailyNeeds: 0.08,
                },
                {
                    name: 'Net Carbohydrates',
                    amount: 0.05,
                    unit: 'g',
                    percentOfDailyNeeds: 0.02,
                },
                {
                    name: 'Fat',
                    amount: 0.03,
                    unit: 'g',
                    percentOfDailyNeeds: 0.05,
                },
                {
                    name: 'Poly Unsaturated Fat',
                    amount: 0,
                    unit: 'g',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Folic Acid',
                    amount: 0,
                    unit: 'µg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Vitamin C',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Mono Unsaturated Fat',
                    amount: 0.01,
                    unit: 'g',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Cholesterol',
                    amount: 0.11,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.04,
                },
                {
                    name: 'Protein',
                    amount: 0.03,
                    unit: 'g',
                    percentOfDailyNeeds: 0.06,
                },
                {
                    name: 'Alcohol',
                    amount: 0,
                    unit: 'g',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Fiber',
                    amount: 0,
                    unit: 'g',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Vitamin D',
                    amount: 0.01,
                    unit: 'µg',
                    percentOfDailyNeeds: 0.09,
                },
                {
                    name: 'Vitamin B2',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.1,
                },
                {
                    name: 'Vitamin B3',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Carbohydrates',
                    amount: 0.05,
                    unit: 'g',
                    percentOfDailyNeeds: 0.02,
                },
                {
                    name: 'Zinc',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.03,
                },
                {
                    name: 'Potassium',
                    amount: 1.35,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.04,
                },
                {
                    name: 'Saturated Fat',
                    amount: 0.02,
                    unit: 'g',
                    percentOfDailyNeeds: 0.12,
                },
                {
                    name: 'Vitamin K',
                    amount: 0,
                    unit: 'µg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Calories',
                    amount: 0.62,
                    unit: 'kcal',
                    percentOfDailyNeeds: 0.03,
                },
                {
                    name: 'Vitamin A',
                    amount: 1.65,
                    unit: 'IU',
                    percentOfDailyNeeds: 0.03,
                },
                {
                    name: 'Copper',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.01,
                },
                {
                    name: 'Selenium',
                    amount: 0.04,
                    unit: 'µg',
                    percentOfDailyNeeds: 0.05,
                },
                {
                    name: 'Iron',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Vitamin B1',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.03,
                },
                {
                    name: 'Sodium',
                    amount: 1.05,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.05,
                },
                {
                    name: 'Caffeine',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0,
                },
                {
                    name: 'Vitamin B5',
                    amount: 0,
                    unit: 'mg',
                    percentOfDailyNeeds: 0.04,
                },
            ],
            properties: [
                {
                    name: 'Glycemic Index',
                    amount: 31,
                    unit: '',
                },
                {
                    name: 'Glycemic Load',
                    amount: 0.02,
                    unit: '',
                },
                {
                    name: 'Nutrition Score',
                    amount: 0.03347826086956522,
                    unit: '%',
                },
            ],
            flavonoids: [
                {
                    name: 'Cyanidin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Petunidin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Delphinidin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Malvidin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Pelargonidin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Peonidin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Catechin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Epigallocatechin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Epicatechin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Epicatechin 3-gallate',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Epigallocatechin 3-gallate',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Theaflavin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Thearubigins',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Eriodictyol',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Hesperetin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Naringenin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Apigenin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Luteolin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Isorhamnetin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Kaempferol',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Myricetin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Quercetin',
                    amount: 0,
                    unit: '',
                },
                {
                    name: "Theaflavin-3,3'-digallate",
                    amount: 0,
                    unit: '',
                },
                {
                    name: "Theaflavin-3'-gallate",
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Theaflavin-3-gallate',
                    amount: 0,
                    unit: '',
                },
                {
                    name: 'Gallocatechin',
                    amount: 0,
                    unit: '',
                },
            ],
            caloricBreakdown: {
                percentProtein: 20.66,
                percentFat: 47.93,
                percentCarbs: 31.41,
            },
            weightPerServing: {
                amount: 1,
                unit: 'g',
            },
        },
        categoryPath: [],
    },
]

const recipe_ingredient = {
    id: 11959,
    name: 'baby arugula',
    amount: 0.38,
    unit: 'cups',
    nutrients: [
        {
            name: 'Choline',
            amount: 1.15,
            unit: 'mg',
            percentOfDailyNeeds: 0,
        },
        {
            name: 'Folate',
            amount: 7.28,
            unit: 'µg',
            percentOfDailyNeeds: 23.43,
        },
        {
            name: 'Sugar',
            amount: 0.15,
            unit: 'g',
            percentOfDailyNeeds: 18.85,
        },
        {
            name: 'Vitamin E',
            amount: 0.03,
            unit: 'mg',
            percentOfDailyNeeds: 16.5,
        },
        {
            name: 'Magnesium',
            amount: 3.53,
            unit: 'mg',
            percentOfDailyNeeds: 30.33,
        },
        {
            name: 'Calcium',
            amount: 12,
            unit: 'mg',
            percentOfDailyNeeds: 18.86,
        },
        {
            name: 'Phosphorus',
            amount: 3.9,
            unit: 'mg',
            percentOfDailyNeeds: 73.02,
        },
        {
            name: 'Vitamin B6',
            amount: 0.01,
            unit: 'mg',
            percentOfDailyNeeds: 81.46,
        },
        {
            name: 'Manganese',
            amount: 0.02,
            unit: 'mg',
            percentOfDailyNeeds: 45.12,
        },
        {
            name: 'Lycopene',
            amount: 0,
            unit: 'µg',
            percentOfDailyNeeds: 0,
        },
        {
            name: 'Vitamin B12',
            amount: 0,
            unit: 'µg',
            percentOfDailyNeeds: 111.19,
        },
        {
            name: 'Net Carbohydrates',
            amount: 0.15,
            unit: 'g',
            percentOfDailyNeeds: 13.25,
        },
        {
            name: 'Fat',
            amount: 0.05,
            unit: 'g',
            percentOfDailyNeeds: 90.09,
        },
        {
            name: 'Poly Unsaturated Fat',
            amount: 0.02,
            unit: 'g',
            percentOfDailyNeeds: 0,
        },
        {
            name: 'Folic Acid',
            amount: 0,
            unit: 'µg',
            percentOfDailyNeeds: 0,
        },
        {
            name: 'Vitamin C',
            amount: 1.13,
            unit: 'mg',
            percentOfDailyNeeds: 32,
        },
        {
            name: 'Mono Unsaturated Fat',
            amount: 0,
            unit: 'g',
            percentOfDailyNeeds: 0,
        },
        {
            name: 'Cholesterol',
            amount: 0,
            unit: 'mg',
            percentOfDailyNeeds: 77.98,
        },
        {
            name: 'Protein',
            amount: 0.19,
            unit: 'g',
            percentOfDailyNeeds: 149.76,
        },
        {
            name: 'Alcohol',
            amount: 0,
            unit: 'g',
            percentOfDailyNeeds: 0,
        },
        {
            name: 'Fiber',
            amount: 0.12,
            unit: 'g',
            percentOfDailyNeeds: 24.15,
        },
        {
            name: 'Vitamin D',
            amount: 0,
            unit: 'µg',
            percentOfDailyNeeds: 3.77,
        },
        {
            name: 'Vitamin B2',
            amount: 0.01,
            unit: 'mg',
            percentOfDailyNeeds: 37.25,
        },
        {
            name: 'Vitamin B3',
            amount: 0.02,
            unit: 'mg',
            percentOfDailyNeeds: 95.64,
        },
        {
            name: 'Carbohydrates',
            amount: 0.27,
            unit: 'g',
            percentOfDailyNeeds: 14.16,
        },
        {
            name: 'Zinc',
            amount: 0.04,
            unit: 'mg',
            percentOfDailyNeeds: 128.87,
        },
        {
            name: 'Potassium',
            amount: 27.67,
            unit: 'mg',
            percentOfDailyNeeds: 46.79,
        },
        {
            name: 'Saturated Fat',
            amount: 0.01,
            unit: 'g',
            percentOfDailyNeeds: 116.27,
        },
        {
            name: 'Vitamin K',
            amount: 8.18,
            unit: 'µg',
            percentOfDailyNeeds: 62.63,
        },
        {
            name: 'Calories',
            amount: 1.88,
            unit: 'kcal',
            percentOfDailyNeeds: 49.25,
        },
        {
            name: 'Vitamin A',
            amount: 177.98,
            unit: 'IU',
            percentOfDailyNeeds: 10.66,
        },
        {
            name: 'Copper',
            amount: 0.01,
            unit: 'mg',
            percentOfDailyNeeds: 27.05,
        },
        {
            name: 'Selenium',
            amount: 0.02,
            unit: 'µg',
            percentOfDailyNeeds: 110.66,
        },
        {
            name: 'Iron',
            amount: 0.11,
            unit: 'mg',
            percentOfDailyNeeds: 48.64,
        },
        {
            name: 'Vitamin B1',
            amount: 0,
            unit: 'mg',
            percentOfDailyNeeds: 38.22,
        },
        {
            name: 'Sodium',
            amount: 2.03,
            unit: 'mg',
            percentOfDailyNeeds: 47.07,
        },
        {
            name: 'Caffeine',
            amount: 0,
            unit: 'mg',
            percentOfDailyNeeds: 0,
        },
        {
            name: 'Vitamin B5',
            amount: 0.03,
            unit: 'mg',
            percentOfDailyNeeds: 25.8,
        },
    ],
}
