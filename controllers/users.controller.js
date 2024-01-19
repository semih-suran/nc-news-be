const { fetchAllUsers } = require("../models/users.model");

const getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch(next);
};

module.exports = { getAllUsers };


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
      .then((comment) => {
        // Additional validation or processing if needed
        return comment;
      });
  };
//       );
//     })
//     .then((result) => result.rows[0])
//     .catch((error) => {
      // if (error.code === "23502") {
      //   return Promise.reject({
      //     status: 400,
      //     msg: "(username) and (body) are required fields.",
      //   });
      // }
//       throw error;
//     });
// };