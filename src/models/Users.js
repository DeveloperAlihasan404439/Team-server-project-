const  mongoose=require('mongoose');
const UsersSchema =mongoose.Schema({
    name: {type: String},
    email: {type: String},
    photoURL: {type: String},
    role: {type: String},
});
const UsersModal = mongoose.model('users', UsersSchema)
module.exports = UsersModal
