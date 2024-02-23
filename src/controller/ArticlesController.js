const { isValidObjectId } = require("mongoose");
const ArticleModels = require("../models/Articles");

exports.getArticles = async (req, res) => {
  const result = await ArticleModels.find();
  res.send(result);
};

exports.getSingleArticle = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: id };
  const result = await ArticleModels.findOne(filter);
  res.send(result);
};
exports.putArticleUpdated = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: id };
  const articles = req.body;
  const updatedDoc = {
    $set: {
      img: articles.img,
      title: articles.title,
      description: articles.description,
      shortDescription: articles.shortDescription,
      date: articles.data,
      whyToUse: articles.whyToUse,
      whereToUse: articles.whereToUse,
      useToHelp: articles.useToHelp,
      benefits: articles.benefits,
      suggestArticle: articles.suggestArticle,
    },
  };
  const result = await ArticleModels.updateOne(filter, updatedDoc);
  res.send(result);
};
exports.patchArticleRejecte = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: id };
  const updatedDoc = {
    $set: {
      status: "rejecte",
    },
  };
  const result = await ArticleModels.updateOne(filter, updatedDoc);
  res.send(result)
};
exports.patchArticleConfirm = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const filter = { _id: id };
  const updatedDoc = {
    $set: {
      status: "confirm",
    },
  };
  const result = await ArticleModels.updateOne(filter, updatedDoc);
  res.send(result)
};
exports.patchArticleLikeIncrement = async (req, res) => {
  const id = req.query.id;
  const filter = { _id: id };
  const LikeIncrement = {
    $inc: {
      like: +1,
    },
  };
  const result = await ArticleModels.updateOne(filter, LikeIncrement);
  res.send(result)
};

exports.deleteArticle = async(req, res)=>{
    const id = req.query.id;
    const filter = {_id: id}
    const result = await ArticleModels.deleteOne(filter)
    res.send(result)
}
exports.postArticle = async(req, res)=>{
    const result = await ArticleModels.create(req.body)
    res.send(result)
}
