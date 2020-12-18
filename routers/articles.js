var express = require("express");
var router = express.Router();

var auth = require("../middlewares/auth");

var Article = require("../models/article");
var Comment = require("../models/comment");

// New article form
router.get("/new", auth.verifyLoggedInUser, (req, res, next) => {
    res.render("newArticleForm");
});

// create article
router.post("/", auth.verifyLoggedInUser, (req, res, next) => {
    req.body.author = req.session.userId;
    Article.create(req.body, (err, articleCreated) => {
        if (err) return next(err);
        res.redirect("/articles");
    });
});

// all articles
router.get("/", (req, res, next) => {
    Article.find({}, (err,articles) => {
        if (err) return next(err);
        res.render("articles", { articles });
    });
});

// get one article
router.get("/:id", (req, res, next) => {
    let id = req.params.id; 

    Article.findById(id).populate("author").populate({ path : "comments", populate : { path : "author" } }).exec((err, article) => {
        if (err) return next(err);
        ////////////////////////
        console.log(article);
        ///////////////////////
        res.render("getArticle", { article });
    });
});

// get update article form

router.get("/:id/update", auth.verifyLoggedInUser, (req, res, next) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return next(err);
        res.render("articleUpdate", { article });
    });
});

// update article
router.post("/:id", (req, res, next) => {
    Article.findByIdAndUpdate(req.params.id, req.body, { new : true }, (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect(`/articles/${req.params.id}`);
    });
});

// delete article
router.get("/:id/delete", (req, res, next) => {
    Article.findByIdAndDelete(req.params.id, (err, deletedArticle) => {
        if (err) return next(err);
        res.redirect("/articles");
    });
});

// Add likes
router.get("/:id/claps", (req, res, next) => {
    let id = req.params.id;
    Article.findByIdAndUpdate(id, { $inc : { claps : 1 } }, (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect("/articles/" + id);
    });
});

// create comment
router.post("/:articleId/comments", auth.verifyLoggedInUser, (req, res, next) => {
    let articleId = req.params.articleId;
    req.body.articleId = articleId;
    let author = req.user._id;
    req.body.author = author;
    Comment.create(req.body, (err, comment) => {
        if (err) return next(err);
        Article.findByIdAndUpdate(articleId, { $push : { comments : comment._id }}, (err, article) => {
            if (err) return next(err);
            res.redirect("/articles/" + articleId );
        });
    });
});

// get comment edit page
router.get("/:articleId/comments/:commentId/edit", auth.verifyLoggedInUser, (req, res, next) => {
    let commentId = req.params.commentId;
    Comment.findById(commentId, (err, comment) => {
        if (err) return next(err);
        res.render("commentEdit", { comment });
    });
});

// Update comment
router.post("/:articleId/comments/:commentId/edit", (req, res, next) => {
    let commentId = req.params.commentId;
    let articleId = req.params.articleId;
    Comment.findByIdAndUpdate(commentId, req.body, (err, UpdatedComment) => {
        if (err) return next(err);
        res.redirect("/articles/" + articleId);
    });
});

// delete comment
router.get("/:articleId/comments/:commentId/delete", auth.verifyLoggedInUser, (req, res, next) => {
    let articleId = req.params.articleId;
    let commentId = req.params.commentId;
    Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
        if (err) return next(err);
        res.redirect("/articles/" + articleId);
    });
});

module.exports = router;