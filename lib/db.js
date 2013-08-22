var mongoose = require('mongoose');
mongoose.connect("mongodb://mrcrifis:campfire12@alex.mongohq.com:10084/nikki");

var userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String
});
exports.User = mongoose.model("user", userSchema);

var grocerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  checked: {
  	type: Boolean,
  	default: false
  },
  user: {
    type: String,
    required: true
  }
});
exports.Grocery = mongoose.model("grocery", grocerySchema);