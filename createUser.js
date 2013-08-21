var db = require('./lib/db');
var pwd = require('pwd');
var user = new db.User();
user.username = "admin";
pwd.hash("demon", function(err, salt, hash) {
  if (err) {
    console.log(err);
  }
  user.salt = salt;
  user.hash = hash;
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("user saved");
    }
  });
});