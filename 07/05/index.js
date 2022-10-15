const mysql = require("mysql");
var express = require("express");
var app = express();
var con = require("./config/db.js");

app.use(express.text());
app.use(express.urlencoded({ extended: true }));

//get request
app.get("/users", (req, res) => {
  con.query("select * from temp", function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

//post requset
app.post("/adduser", (req, res) => {
  req.body = JSON.parse(req.body);
  con.query(
    `insert into temp (first_name, last_name, email, phone) values (?, ?, ?, ?)`,
    [req.body.first_name, req.body.last_name, req.body.email, req.body.phone],
    function (err, data) {
      if (err) throw err;
      res.send({ code: "1", message: "user added" });
    }
  );
});

//put request
app.put("/update/:id", function (req, res) {
  req.body = JSON.parse(req.body);
  con.query(
    `update temp set first_name='${req.body.first_name}', last_name='${req.body.last_name}', email='${req.body.email}' where id = '${req.params.id}'`,
    function (err, data) {
      if (err) throw err;
      res.send({ code: "1", message: "user update" });
    }
  );
});

//delete request
app.delete("/delete/:id", function (req, res) {
  var id = req.params.id;

  con.query("delete from temp where id = ?", id, function (err, data) {
    if (err) throw err;
    res.send({ code: "1", message: "user deleted" });
  });
});

app.listen(process.env.PORT, () => {
  console.log("run at " + process.env.PORT);
});
