const {
  fetchCommentsByArticleId,
  addCommentToArticle,
} = require("../models/comments.model");
const { checkIfArticleExists } = require("../models/articles.model");

const getCommentsByArticleIdLifo = async (req, res, next) => {
  const articleId = req.params.article_id;

  try {
    const articleExists = await checkIfArticleExists(articleId);

    if (!articleExists) {
      throw { status: 404, msg: "Non-existent Article ID" };
    }

    const comments = await fetchCommentsByArticleId(articleId);

    if (comments.length === 0) {
      throw { status: 404, msg: "No Comments Found For This Article ID..." };
    }
    res.send(comments);
  } catch (error) {
    next(error);
  }
};

const postCommentToArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const { username, body } = req.body;

  checkIfArticleExists(articleId)
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ msg: "Non-existent Article ID" });
      }
      return addCommentToArticle(articleId, username, body);
    })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((error) => {
      if (error.status === 400 && error.msg === "(username) and (body) are required fields.") {
        return res.status(400).send(error);
      }
      next(error);
    });
};

module.exports = { getCommentsByArticleIdLifo, postCommentToArticle };
