const UsersModal = require("../models/Users");

exports.getUserController = async (req, res) => {
  const resutl = await UsersModal.find();
  // console.log(resutl)
  res.send(resutl);
};
exports.getSingleUser = async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const resutl = await UsersModal.findOne(query);
  res.send(resutl);
};

exports.putUser = async(req, res)=>{
    const email = req.params.email;
    console.log("my email", email);
    const filter = { email: email };
    const updateProduct = req.body;
    const updateDoc = {
      $set: {
        role: updateProduct.role,
      },
    };
    const result = await UsersModal.updateOne(filter, updateDoc);
    res.send(result);
}

exports.postUser = async (req, res) => {
  const userData = req.body;
  const query = { userEmail: userData.userEmail };
  const isUserExist = await UsersModal.findOne(query);
  if (isUserExist) {
    return res.send({ message: "UserExist", InsertedId: null });
  }
  const result = await UsersModal.create(userData);
  res.send(result);
};
