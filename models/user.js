const mongoose = require('mongoose'),
      passpostLocalMongoose = require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passpostLocalMongoose);

module.exports = mongoose.model("User", UserSchema);