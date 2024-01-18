const express = require("express");
const app = express();
app.use(express.json());
const getAllTopics = require("./controllers/topics.controller");
const getAllEndpoints = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getArticlesByLifo,
  patchArticleVotes,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleIdLifo,
  postCommentToArticle,
  deleteComment,
} = require("./controllers/comments.controller");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");

const {getAllUsers} = require("./controllers/users.controller")

app.get("/api/topics", getAllTopics);

app.get("/api/endpoints", getAllEndpoints);

app.get("/api/articles", getArticlesByLifo);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleIdLifo);

app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
