var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node"
});

module.exports= con;

con.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});