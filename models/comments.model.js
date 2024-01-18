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

const checkIfCommentExists = (commentId) => {
  if (isNaN(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid (comment_id) Format. Must Be a Number.",
    });
  }
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [commentId])
    .then((result) => result.rows.length > 0);
};

const deleteCommentByCommentId = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [commentId])
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    });
};

module.exports = {
  fetchCommentsByArticleId,
  addCommentToArticle,
  deleteCommentByCommentId,
  checkIfCommentExists,
};
