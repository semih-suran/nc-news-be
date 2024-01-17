const db = require("../db/connection");

const fetchArticleById = (articleId) => {
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

module.exports = { fetchArticleById, fetchArticlesWithCommentCount };
