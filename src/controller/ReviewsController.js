const ReviewsModel = require("../models/Reviews")

exports.getReviws= async(req,res)=>{
    const result = await ReviewsModel.find()
    res.send(result)
}
exports.deleteReviews = async(req, res)=>{
    const id = req.query.id;
    const filter = {_id: id}
    const result = await ReviewsModel.deleteOne(filter)
    res.send(result)
}

exports.postReviews = async(req, res)=>{
    const result = await ReviewsModel.create(req.body)
    res.send(result)
}