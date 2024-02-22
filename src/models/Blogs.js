const { default: mongoose } = require("mongoose");

const BlogsSchema = mongoose.Schema({
    title: {type: String},
    description: {type: String},
    image: {type: String},
    authorImg: {type: String},
    authorName: {type: String},
    authorPosition: {type: String},
    travelFrom: {type: String},
    travelDate: {type: String},
});
const BlogModels = mongoose.model('blogs', BlogsSchema);
module.exports = BlogModels;