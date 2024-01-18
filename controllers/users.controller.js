const { fetchAllUsers } = require("../models/users.model");

const getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch(next);
};

module.exports = { getAllUsers };
