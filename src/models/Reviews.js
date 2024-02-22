const  mongoose=require('mongoose');
const ReviewsSchema=mongoose.Schema({
    image:{type:String},
    review:{type:String},
    rating:{type:String},
    email:{type:String},
    name:{type:String},
    date:{type:String},
});

const ReviewsModel=mongoose.model('reviews',ReviewsSchema);
module.exports=ReviewsModel
