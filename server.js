var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var request = require("request");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("authorization_code/public"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("App listening on Port " + PORT);
});



require("./authorization_code/app.js")(app, path, bodyParser);