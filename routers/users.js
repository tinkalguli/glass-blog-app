var express = require('express');
var router = express.Router();

var User = require("../models/user");

// get all users
router.get("/", (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) return next(err);
      res.render("users", { users });
    });
});

// get register form
router.get('/register', (req, res) => {
    res.render('registerForm');
});

//get login form
router.get('/login', (req, res) => {
    res.render('loginForm');
});

// Create user
router.post("/register", (req, res, next) => {
    var { email } = req.body;
    User.findOne({ email }, (err, user) => {
      if (err) return next(err);
      if(user) {
        res.redirect("/users/register");
      } else {
        User.create(req.body, (err, user) => {
          if (err) return next(err);
          res.redirect("/users/login");
        });
      }
    });
});

// User Login
router.post("/login", (req, res, next) => {
    var { email, password } = req.body;
  
    if (!email || !password) {
      return res.redirect("/users/login");
    }
  
    User.findOne({ email }, (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/users/login");
      if (!user.verifyPassword(password)) {
        return res.redirect("/users/login");
      }
      // add user to the session
      req.session.userId = user.id;
      res.redirect("/users");
    });
});

// Log out
router.get("/logout", (req, res) => {
    req.session.destroy();
    // req.clearCookie("userId");
    res.redirect("/");
});

// get one user
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id, (err, userInfo) => {
    if (err) return next(err);
    res.render("userProfile", { userInfo });
  });
});

module.exports = router;