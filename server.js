var mysql = require('mysql');
var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

// connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "parleen25",   // <-- change if your password is different
  database: "lost_found"
});

// connect
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// INSERT
app.post("/addLost", function(req, res) {

  var item = req.body.item;
  var description = req.body.description;
  var location = req.body.location;

  var sql = "INSERT INTO lost_items (item_name, description, location) VALUES ('"+item+"','"+description+"','"+location+"')";

  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send("1 record inserted");
  });
});

// SELECT
app.get("/getLostItems", function(req, res) {

  con.query("SELECT * FROM lost_items", function (err, result) {
    if (err) throw err;
    res.json(result);
  });

});

// server
app.listen(5000, function() {
  console.log("Server running on http://localhost:5000");
});