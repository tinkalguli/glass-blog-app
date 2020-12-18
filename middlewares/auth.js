var User = require("../models/user")

module.exports = {
    verifyLoggedInUser : (req, res, next) => {
        if (req.session && req.session.userId) {
            next();
        } else {
            res.redirect("/users/login");
        }
    },
    currentLoggedUserInfo : (req, res, next) => {
        if (req.session && req.session.userId) {
            var userId = req.session.userId;
            User.findById(userId, { name : 1, email : 1}, (err, user) => {
                req.user  = user;
                res.locals.user = user;
                next();
            });
        } else {
            req.user = null;
            res.locals.user = null;
            next();
        }
    },
    urlInfo : (req, res, next) => {
        res.locals.url = req.url;
        next();
    }
}