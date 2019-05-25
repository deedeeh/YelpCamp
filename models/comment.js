const mongoose = require('mongoose');

//mongoose Schema setup
const commentSchema = mongoose.Schema({
  text: String,
  author: String
});

module.exports = mongoose.model("Comment", commentSchema)