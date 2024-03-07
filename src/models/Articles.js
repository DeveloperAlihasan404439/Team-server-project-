const { default: mongoose } = require("mongoose");

const ArticleSchema = mongoose.Schema({
    img: {type: String},
    title: {type: String},
    description: {type: String},
    date: {type: String},
    whyToUse: {type: String},
    status: {type: String},
    useToHelp: {type: String},
    whereToUse: {type: String},
    shortDescription: {type: String},
    benefits: {type: Array},
    suggestArticle: {type: Array},
    like: {type: Number},
    user_Email: {type: String},
    user_Name: {type: String},
    user_photo: {type: String},
})
const ArticleModels = mongoose.model('articles', ArticleSchema)
module.exports = ArticleModels;

