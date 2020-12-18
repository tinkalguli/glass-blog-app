const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    text : { type : String, required : true, minlength : 4 },
    author : { type : Schema.Types.ObjectId, ref : "User", required : true },
    articleId : { type : Schema.Types.ObjectId, required: true, ref : "Article"}
}, { timestamps : true });

module.exports = mongoose.model("Comment", commentSchema);