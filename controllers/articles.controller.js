const {
  fetchArticleById,
  fetchArticlesWithCommentCount,
} = require("../models/articles.model");

const getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId)) {
    //convert to number then check if that is actually a number
    return res
      .status(400)
      .json({ msg: "Invalid article_id Format. Must Be a Number." });
  }
  fetchArticleById(articleId)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      res.status(200).json(article[0]);
    })
    .catch(next);
};

const getArticlesByLifo = (req, res, next) => {
  fetchArticlesWithCommentCount()
    .then((articles) => {
      res.json(articles);
    })
    .catch(next);
};

module.exports = { getArticleById, getArticlesByLifo };
