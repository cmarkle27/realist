var mongoose = require('mongoose');
var config = require('../config/mongo.json');

mongoose.connect('mongodb://' + config.user + ':' + config.password + '@' + config.url);

var userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String
});
exports.User = mongoose.model("user", userSchema);

var itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  is_checked: {
    type: Boolean,  
    default: false,
  }
});
var listSchema = new mongoose.Schema({
  items: [itemSchema],
  users: [String]
});
exports.List = mongoose.model("list", listSchema);
