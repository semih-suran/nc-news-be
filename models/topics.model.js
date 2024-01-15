const db = require("../db/connection");

const fetchAllTopics = () => {
  return db
    .query("SELECT * FROM topics")
    .then((result) => result.rows)
    .catch((err) => {
      throw err;
    });
};

module.exports = fetchAllTopics;
