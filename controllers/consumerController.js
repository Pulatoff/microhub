const Consumer = require('../models/consumerModel')

exports.addConsumer = async (req, res, next) => {
    try {
        // weight: Float!
        // height: Float!
        // favorite_foods: [String]
        // least_favorite_foods: [String]
        // allergies: [String]
        // preferences: String
        // gender: Gender!
        const { weight, height, favorite_foods, least_favorite_foods, allergies, preferences, gender } = req.body
        const consumer = await Consumer.create({
            weight,
            height,
            favorite_foods,
            least_favorite_foods,
            allergies,
            preferences,
            gender,
            userIdId: req.user.id,
        })
        res.status(200).json({
            status: 'success',
            data: {
                consumer,
            },
        })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}
