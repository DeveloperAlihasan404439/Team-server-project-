const CommentModel = require("../models/Comment");

exports.getComment = async (req, res) => {
  const id = req.params.id;
  const filter = { id: id };
  const result = await CommentModel.find(filter);
  res.send(result);
};
exports.postComment = async(req, res)=>{
    const result = await CommentModel.create(req.body);
    res.send(result)
}
