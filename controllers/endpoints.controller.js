const fs = require("fs");
const endpointsPath = "./endpoints.json";

const listAll = (req, res) => {
  try {
    const endpoints = JSON.parse(fs.readFileSync(endpointsPath, "utf-8"));
    res.json(endpoints);
  } catch (error) {
    console.log("ERROR >>> ", error);
  }
};

module.exports = listAll;
