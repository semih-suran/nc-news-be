const {
  fetchArticleById,
  fetchArticlesWithCommentCount,
  patchVotes,
} = require("../models/articles.model");

const { checkIfArticleExists } = require("../models/articles.model");

const getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;

  fetchArticleById(articleId)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      res.status(200).send(article[0]);
    })
    .catch(next);
};

const getArticlesByLifo = (req, res, next) => {
  fetchArticlesWithCommentCount()
    .then((articles) => {
      res.send(articles);
    })
    .catch(next);
};

const patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const { inc_votes, ...moreKeys } = req.body;
  const votesValue = req.body.inc_votes;

  checkIfArticleExists(articleId)
    .then((articleExists) => {
      if (!articleExists) {
        return res.status(404).send({ msg: "Non-existent Article ID" });
      }
      if (Object.keys(moreKeys).length > 0 || inc_votes === undefined) {
        return res
          .status(400)
          .send({ msg: "(inc_votes) is required and should be the only key." });
      }
      return patchVotes(articleId, votesValue);
    })
    .then((article) => {
      res.status(201).send(article);
    })
    .catch(next);
};

module.exports = { getArticleById, getArticlesByLifo, patchArticleVotes };
