const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const array = require("lodash/array");
const object = require("lodash/fp/object");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/articleDB" || process.env.MONGOURI, {
  useNewUrlParser: true,
});

const articleSchema = mongoose.Schema({
  title: String,
  post: String,
});

const Article = mongoose.model("Article", articleSchema);

const homeStartingContent =
  "This a blog with articles concerning my learning journey.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/articles", function (req, res) {
  Article.find({ title: { $ne: null } }).then(function (foundArticles) {
    if (foundArticles) {
      res.render("articles", {
        homeContent: homeStartingContent,
        articles: foundArticles,
      });
    }
  });
});

app.get("/articles/:article", function (req, res) {
  const aArticle = _.capitalize(req.params.article);
  Article.findOne({ title: aArticle }).then(function (foundArticle) {
    if (foundArticle) {
      res.render("post", {article: foundArticle});
    }
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Article({
    title: req.body.postTitle,
    post: req.body.postBody,
  });

  post.save();

  res.redirect("/articles");
});

app.listen(3000 || process.env.PORT, function () {
  console.log("Server started on port 3000");
});
