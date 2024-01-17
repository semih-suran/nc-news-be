const express = require("express");
const app = express();
app.use(express.json());
const getAllTopics = require("./controllers/topics.controller");
const getAllEndpoints = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getArticlesByLifo,
} = require("./controllers/articles.controller");
const {getCommentsByArticleIdLifo} = require('./controllers/comments.controller')
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");

app.get("/api/topics", getAllTopics);

app.get("/api/endpoints", getAllEndpoints);

app.get("/api/articles", getArticlesByLifo);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleIdLifo);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
