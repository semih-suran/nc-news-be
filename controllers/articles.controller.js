const fetchArticlesById = require("../models/articles.model");

const listArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  if(isNaN(articleId)){
    //convert to number then check if that is actually a number
    return res.status(400).json({ msg: "Invalid article_id Format. Must Be a Number." });
  }
  fetchArticlesById(articleId)
    .then((article) => {
      if (article.length === 0) {
        res.status(404).json({ msg: "Article Not Found" });
      } else {
        res.status(200).json({ article });
        console.log(`Article by ID:${articleId} >>> `, article);
      }
    })
    .catch(next);
};

module.exports = listArticlesById;
