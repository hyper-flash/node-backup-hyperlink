var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "9_db_travel"
});

module.exports= con;

con.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});

