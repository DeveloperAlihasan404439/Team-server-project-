const UsersModal = require("../models/Users");

exports.getUserController = async (req, res) => {
  const resutl = await UsersModal.find();
  res.send(resutl);
};
exports.getSingleUser = async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const resutl = await UsersModal.findOne(query);
  res.send(resutl);
};
exports.postUser = async (req, res) => {
  const userData = req.body;
  const query = { email: userData.userEmail };
  const isUserExist = await UsersModal.findOne(query);
  if (isUserExist) {
    return res.send({ message: "UserExist", InsertedId: null });
  }
  const result = await UsersModal.create(userData);
  res.send(result);
};
