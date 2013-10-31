var db = require('./lib/db');
var list = new db.List();
list.users.push("52152e5ff8e08b0507000001");
list.items.push({ name: 'Coldcuts' });
list.items.push({ name: 'Flatbread' });
list.items.push({ name: 'Spinich' });

list.save(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("list saved");
    }
});
