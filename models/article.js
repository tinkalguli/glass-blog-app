const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let articleSchema = new Schema({
    title : { type : String, required : true, trim : true },
    description : { type : String, required : true, minlength : 30 },
    tags : [{ type : String }],
    claps : [{ type : Schema.Types.ObjectId, ref : "User" }],
    author : { type : Schema.Types.ObjectId, ref : "User", required : true },
    comments : [{
        type : Schema.Types.ObjectId,
        ref : "Comment"
    }],
}, { timestamps : true });

module.exports = mongoose.model("Article", articleSchema);