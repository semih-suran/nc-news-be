const {
  fetchCommentsByArticleId,
  checkIfArticleExists,
  addCommentToArticle,
} = require("../models/comments.model");

const getCommentsByArticleIdLifo = (req, res, next) => {
  const articleId = req.params.article_id;

  if (isNaN(articleId)) {
    return res
      .status(400)
      .send({ msg: "Invalid article_id Format. Must Be a Number." });
  }

  checkIfArticleExists(articleId)
    .then((articleExists) => {
      if (!articleExists) {
        return res.status(400).send({ msg: "Non-existent Article ID" });
      }

      fetchCommentsByArticleId(articleId)
        .then((comments) => {
          if (comments.length === 0) {
            return res
              .status(404)
              .send({ msg: "No Comments Found For This Article ID..." });
          }
          res.send(comments);
        })
        .catch(next);
    })
    .catch(next);
};

const postCommentToArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;
  if (!username || !body) {
    return res
      .status(400)
      .send({ msg: "(username) and (body) are required fields." });
  }
  if (isNaN(articleId)) {
    return res
      .status(400)
      .send({ msg: "Invalid article_id Format. Must Be a Number." });
  }
  checkIfArticleExists(articleId)
    .then((exists) => {
      if (!exists) {
        return res.status(400).send({ msg: "Non-existent Article ID" });
      }
      return addCommentToArticle(articleId, username, body);
    })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
};

module.exports = { getCommentsByArticleIdLifo, postCommentToArticle };
