const { fetchCommentsByArticleId } = require("../models/comments.model");

const getCommentsByArticleIdLifo = (req, res, next) => {
  const articleId = req.params.article_id;
  if (isNaN(articleId)) {
    return res
      .status(400)
      .send({ msg: "Invalid article_id Format. Must Be a Number." });
  }
  fetchCommentsByArticleId(articleId)
    .then((comments) => {
        if(comments.length===0){
            return res.status(404).send({ msg: "No Comments Found For This Article ID..."})
        }
      res.send(comments);
    })
    .catch(next);
};

const postCommentToArticle = ()=>{

}

module.exports = { getCommentsByArticleIdLifo, postCommentToArticle };
