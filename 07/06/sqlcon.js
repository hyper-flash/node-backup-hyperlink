var mysql = require('mysql');
require('dotenv').config()

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: "",
  database: process.env.DB_DATABASE
});

module.exports= con;

con.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});