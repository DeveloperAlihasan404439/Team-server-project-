const { default: mongoose, model } = require("mongoose");

const NotesSchema = mongoose.Schema({
    notes: {type: String},
    user_name: {type: String},
    user_Email: {type: String},
    user_images: {type: String},

})
const NotesModels = mongoose.model('notes', NotesSchema)
module.exports = NotesModels