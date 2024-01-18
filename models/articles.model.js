const db = require("../db/connection");

const fetchArticleById = (articleId) => {
  if (isNaN(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid (article_id) Format. Must Be a Number.",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => result.rows);
};

const fetchArticlesWithCommentCount = () => {
  return db
    .query(
      `
    SELECT
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
  FROM
    articles
  LEFT JOIN
    comments ON articles.article_id = comments.article_id
  GROUP BY
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url
  ORDER BY
    articles.created_at DESC;
`
    )
    .then((result) => result.rows);
};

const checkIfArticleExists = (articleId) => {
  if (isNaN(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid (article_id) Format. Must Be a Number.",
    });
  }

  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((result) => result.rows.length > 0);
};

const patchVotes = (articleId, inc_votes) => {
  if (isNaN(articleId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid (article_id) Format. Must Be a Number.",
    });
  }

  return db
    .query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS votes INT;`)
    .then(() => {
      return db.query(
        `UPDATE articles SET votes = COALESCE(votes, 0) + $2 WHERE article_id = $1 RETURNING *;`,
        [articleId, inc_votes]
      );
    })
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    });
};

module.exports = {
  fetchArticleById,
  fetchArticlesWithCommentCount,
  patchVotes,
  checkIfArticleExists,
};
