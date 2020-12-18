var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/protected", auth.verifyLoggedInUser, (req, res) => {
    res.send("success");
});

module.exports = router;