var mongoose = require('mongoose');
// move to config!!!
mongoose.connect("mongodb://mrcrifis:campfire12@alex.mongohq.com:10084/nikki");

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
