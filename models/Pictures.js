const mongoose = require("mongoose");

// Step 1: Define our Schema
// See: https://mongoosejs.com/docs/guide.html
/*
"Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection."
*/
const definitionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  fileName: String,
  attribution: {
    source: String,
    credit: String,
    url: String
  }
});

module.exports = mongoose.model("Pictures", definitionSchema);
