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

exports.putUser = async(req, res)=>{
    const email = req.params.email;
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
exports.putProfileUpdated = async(req, res)=>{
    const email = req.query.email;
    const filter = { email: email };
    const options = { upsert: true };
    const updateProduct = req.body;
    const updateDoc = {
      $set: {
        name: updateProduct.name,
        photoURL: updateProduct.img,
        bio: updateProduct.bio,
        education: updateProduct.education,
        city: updateProduct.city,
        mobile: updateProduct.mobile,
      },
    };
    const result = await UsersModal.updateOne(filter, updateDoc,options);
    res.send(result);
}

exports.postUser = async (req, res) => {
  const userData = req.body;
  console.log(userData,"line 29")
  const query = { email: userData.userEmail };
  const isUserExist = await UsersModal.findOne(query);
  console.log(isUserExist)
  if (isUserExist) {
    return res.send({ message: "UserExist", InsertedId: null });
  }
  const result = await UsersModal.create(userData);
  console.log(result, 'line 32')
  res.send(result);
};
