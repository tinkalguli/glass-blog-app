var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/github", passport.authenticate("github"));

router.get("/github/callback", passport.authenticate("github", { failureRedirect : "/" }), (req, res) => {
  res.redirect("/articles");
});

router.get("/google", passport.authenticate("google", { scope : ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect : "/"}), (req, res) => {
  res.redirect("/articles");
});

module.exports = router;