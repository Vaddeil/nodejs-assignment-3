const path = require("path");
const express = require("express");
const ejs = require("ejs");
const gallery = require("./gallery");
const pageInfo = require("./pageInfo");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URL;
var slugify = require("slugify");

const app = express();
const Pictures = require("./models/Pictures.js");

// Moment Module
const moment = require("moment");
const year = "YYYY";

app.locals.moment = require("moment");
app.locals.year = year;

// app.locals.gallery = gallery;
app.set("view engine", "ejs");

/*******************************/
/* Mongoose/MongoDB Connection */
/*******************************/

// Set up a pending connection to the database
// See: https://mongoosejs.com/docs/
const dbURI = process.env.MONGODB_URL;
// console.log(dbURI);
mongoose.connect(dbURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Connect to database. Mongoose handles the asynchronous aspects internally so we don't have to.
var db = mongoose.connection;

// Callback incase theres an error
db.on("error", function(error) {
  console.log(`Connection Error: ${error.message}`);
});
// Callback to let us know we're connected
db.once("open", function() {
  console.log("Connected to DB...");
});
app.get("/", function(req, res) {
  res.render("index", { title: "Home Page" });
});
app.get("/galleryList", function(req, res) {
  Pictures.find(function(error, result) {
    app.locals.gallery = result;
    res.render("galleryList", { pictures: result });
  });
});

/* ************************** */
/* For loop to save information to MongoDB cluster, only to be used once so that the data doesnt double */
/* ************************** */
// for (x of gallery) {
//   let photos = new Pictures(x);
//   photos.save(function(error, result) {
//     if (error) {
//       console.log(error);
//     }
//   });
// }

/* ************************** */
/*  Pull data from MongoDB cluster to render onto page */
/* ************************** */

app.get("/gallery/:id", function(req, res) {
  app.locals.photoid = req.params.id;
  Pictures.findOne({ id: req.params.id }, function(error, result) {
    res.render("galleryID", { picture: result });
  });
});

/* ************************** */
// Endpoints
/* ************************** */

app.get("/", function(req, res) {
  res.render("index", pageInfo.index);
});
app.get("/galleryList", function(req, res) {
  res.render("galleryList", pageInfo.gallery);
});

app.get("/gallery/:id", function(req, res) {
  app.locals.photoid = req.params.id;
  res.render("galleryID", pageInfo.photo);
});

// CSS Styling from root public directory
app.use(express.static(path.join(__dirname, "public")));

//error page setup//
app.use(function(req, res, next) {
  res.status(404);
  res.send("404: File Not Found");
});

//local:host:3000//
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
