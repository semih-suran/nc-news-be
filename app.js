const express = require("express");
const app = express();
app.use(express.json());
const getAllTopics = require("./controllers/topics.controller");
const listAllEndpoints = require("./controllers/endpoints.controller");
const listArticlesById = require("./controllers/articles.controller");

app.get("/api/topics", getAllTopics);

app.get("/api/endpoints", listAllEndpoints);

app.get("/api/articles/:article_id", listArticlesById);

app.use((err, req, res, next) => {
  console.log("Error In Middleware", err);
  if (err.code === "22P020" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else if (err.status === 404) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
