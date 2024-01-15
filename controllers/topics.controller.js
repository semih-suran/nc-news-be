const fetchAllTopics = require("../models/topics.model");

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch(next);
};

module.exports = getAllTopics;
