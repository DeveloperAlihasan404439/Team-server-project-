const BlogModels = require("../models/Blogs")

exports.getBlogs = async(req, res)=>{
    const result = await BlogModels.find()
    res.send(result)
}