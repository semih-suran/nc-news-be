const db = require("../db/connection");

const fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [articleId]
    )
    .then((result) => result.rows);
};

module.exports = { fetchCommentsByArticleId };
