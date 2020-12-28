var express = require('express');
var router = express.Router();
var multer = require("multer");
var { multerUploads } = require("../middlewares/multer");
var User = require("../models/user");
var Article = require("../models/article");
var { resolve } =  require('path');
var { uploader, cloudinaryConfig } = require('../config/cloudinary');
var { multerUploads, dataUri } = require('../middlewares/multer');
var auth = require("../middlewares/auth");
var cloudinary = require("cloudinary")

// get all users
router.get("/", (req, res, next) => {
 
    User.find({}).sort({updatedAt : 'descending'}).exec((err, users) => {
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
        res.redirect("/users/login");
      } else {
        User.create(req.body, (err, user) => {
          if (err) return next(err);
          req.session.userId = user.id;
          res.redirect("/users/avatar");
        });
      }
    });
});


// get Avatar form

router.get("/avatar", auth.verifyLoggedInUser, (req, res) => {
  res.render("avatarUpload", );
});

// post avatar
/*
var storage = multer.diskStorage({
  destination : function(req, file, cb) {
    cb(null, "upload/");
  },
  filename : function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var upload = multer({ storage : storage }); */

router.post("/avatar", auth.verifyLoggedInUser, multerUploads, (req, res, next) => {
  console.log(req.file)
  if(req.file) {
    var file = dataUri(req).content;
    return uploader.upload(file).then((result) => {
      var avatar = result.url.slice(0, result.url.indexOf("/upload") + 8)
                    + "w_300,h_300,c_fill,g_face"
                    + result.url.slice(result.url.indexOf("/upload") + 7, result.url.length);
      
      User.findByIdAndUpdate(req.user.id, { avatar }, (err, updatedUser) => {
        if (err) return next(err);
        res.render("avatarUpload", { updatedUser });
      });
    }).catch( (err) => {
      return next(err);
    });
  } else {
    res.redirect("/users/avatar");
  }
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
      res.redirect("/articles");
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
  let id = req.params.id;
  User.findById(id, (err, userInfo) => {
    if (err) return next(err);
    Article.find({ author : id }, (err, articles) => {
      if(err) return next(err);
      res.render("singleUser", { articles, userInfo });
    });
  });
});

module.exports = router;