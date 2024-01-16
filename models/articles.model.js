const db = require("../db/connection");

const fetchArticlesById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => result.rows);
};

module.exports = fetchArticlesById;
