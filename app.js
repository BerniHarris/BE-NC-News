const express = require("express");
const { getTopics } = require("./controllers/topicControllers");
const {
  getArticleById,
  patchArticle,
  getArticles,
  getArticleComments,
} = require("./controllers/articleControllers");
const { getUserNames } = require("./controllers/userControllers");
const {
  error404,
  customError,
  psqlError,
  error500,
} = require("./errors/errors");
const app = express();

app.use(express.json());

//-------GET------
app.get("/api/topics", getTopics);
app.get("/api/users", getUserNames);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);

//-------PATCH------
app.patch("/api/articles/:article_id", patchArticle);

//-------ALL------
app.all("/*", error404);

//-------USE------
app.use(customError);
app.use(psqlError);
app.use(error500);

module.exports = app;
