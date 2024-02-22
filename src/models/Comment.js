const { default: mongoose } = require("mongoose");

const CommentSchema = mongoose.Schema({
    comment: {type: String},
    commentTime: {type: String},
    id: {type: String},
    userName: {type: String},
    userImage: {type: String},
});
const CommentModel = mongoose.model('comments', CommentSchema);
module.exports = CommentModel