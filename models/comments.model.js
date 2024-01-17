const db = require("../db/connection");

const fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [articleId]
    )
    .then((result) => result.rows);
};

const checkIfArticleExists = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((result) => result.rows.length > 0);
};

const addCommentToArticle = (articleId, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [articleId, username, body]
    )
    .then((result) => result.rows[0])
    .catch((error) => {
      console.error("addCommentToArticle ERROR >>", error);
      throw error;
    });
};

module.exports = {
  fetchCommentsByArticleId,
  checkIfArticleExists,
  addCommentToArticle,
};
