const db = require("../db/connection");

const fetchAllUsers = () => {
  return db.query("SELECT * FROM users").then((result) => result.rows);
};

module.exports = { fetchAllUsers };
