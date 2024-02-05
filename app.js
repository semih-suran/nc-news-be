const express = require("express");
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const getAllTopics = require("./controllers/topics.controller");
const getAllEndpoints = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getAllArticlesByLifo,
  patchArticleVotes,
  getArticlesByTopicQuery,
} = require("./controllers/articles.controller");
const {
  getAllCommentsByLifo,
  getCommentsByArticleIdLifo,
  postCommentToArticle,
  deleteComment,
} = require("./controllers/comments.controller");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");

const { getAllUsers } = require("./controllers/users.controller");

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/comments", getAllCommentsByLifo)

app.get("/api/articles", getArticlesByTopicQuery);

app.get("/api/articles", getAllArticlesByLifo);

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
