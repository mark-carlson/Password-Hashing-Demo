var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var crypto = require("crypto");
var bcrypt = require("bcrypt");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Routes

// Route to post our form submission to mongoDB via mongoose
app.post("/submitdata", function(req, res) {
  // Create a new user using req.body
  console.log("req.body", req.body);
  console.time("SHA timer");
  const hashedData = crypto
    .createHash(req.body.shaVersion)
    .update(req.body.content)
    .digest("hex");
  console.timeEnd("SHA timer");
  console.log("hashed data", hashedData);
  res.json({ content: hashedData });
});

app.post("/submitdata2", function(req, res) {
  // Create a new user using req.body
  console.log("req.body", req.body);
  console.time("SHA + SALT timer");
  const SALT = "$b8&uuiE1!?>PoQxYVp%yT";
  const hashedData = crypto
      .createHash("sha256")
      .update(SALT + req.body.content2)
      .digest("hex");
  console.timeEnd("SHA + SALT timer");
  console.log("hashed data", hashedData);
  res.json({ content: hashedData });
});

app.post("/submitdata3", function(req, res) {
  // Create a new user using req.body
  console.log("req.body", req.body);
  console.time("BCRYPT timer");
  bcrypt.hash(
    req.body.content3,
    (Number(req.body.saltRoundsNumber) <= 17 &&
      Number(req.body.saltRoundsNumber)) ||
      10,
    function(err, hash) {
      // Store hash in your password DB.
      console.timeEnd("BCRYPT timer");
      console.log("hash", hash);
      res.json({ content: hash });
    }
  );
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
