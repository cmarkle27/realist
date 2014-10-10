var db = require('./lib/db');
var item = new db.Grocery();
item.user = "52152e5ff8e08b0507000001";
item.title = "frog legs";

item.save(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("item saved");
    }
});
