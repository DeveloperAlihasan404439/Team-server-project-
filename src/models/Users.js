const  mongoose=require('mongoose');
const UsersSchema =mongoose.Schema({
    name: {type: String},
    email: {type: String},
    photoURL: {type: String},
    role: {type: String},
    bio: {type: String},
    education: {type: String},
    city: {type: String},
    mobile: {type: String},
});
const UsersModal = mongoose.model('users', UsersSchema)
module.exports = UsersModal
