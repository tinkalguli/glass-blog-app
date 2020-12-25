var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : { type : String, require : true },
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true, minlength : 4 },
    avatar : String
}, { timestamps : true });

userSchema.pre("save", function(next) {
    if (this.password) {
        bcrypt.hash(this.password, 12, (err, hash) => {
            if(err) return next(err);
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", userSchema);