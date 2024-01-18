const db = require("../db/connection");

const fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [articleId]
    )
    .then((result) => result.rows);
};

const addCommentToArticle = (articleId, username, body) => {
  if (isNaN(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid article_id Format. Must Be a Number.",
    });
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((userResult) => {
      if (userResult.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "(username) does not exist.",
        });
      }
      return db.query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
        [articleId, username, body]
      );
    })
    .then((result) => result.rows[0])
    .catch((error) => {
      if (error.code === "23502") {
        return Promise.reject({
          status: 400,
          msg: "(username) and (body) are required fields.",
        });
      }
      throw error;
    });
};

module.exports = { fetchCommentsByArticleId, addCommentToArticle };
