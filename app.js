const express = require("express");
const app = express();
app.use(express.json());
const getAllTopics = require("./controllers/topics.controller");
const listAll = require("./controllers/endpoints.controller");

app.get("/api/topics", getAllTopics);

app.get("/api/endpoints", listAll);

module.exports = app;