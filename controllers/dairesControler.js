const Dairy = require('../models/dairyModel')

exports.addDairy = async (req, res, next) => {
    const { course, serving, food_id, quantity, programId } = req.body
    const program = await Dairy.create({
        course,
        serving,
        food_id,
        quantity,
        programId,
    })
    res.status(200).json({ status: 'success', data: { program } })
}

exports.getDairy = async (req, res, next) => {
    const program = await Dairy.findAll()
    res.status(200).json({ status: 'success', data: { program } })
}

exports.getOneDairy = async (req, res, next) => {
    const program = await Dairy.findByPk(req.params.id)
    res.status(200).json({ status: 'success', data: { program } })
}

exports.updateDairy = async(req,res,next)=>{
    const dairy = await Dairy.update(req.body,{where:{id:req.params.id}})
    res.status(200).json({ status: 'success', data: { dairy } })
}