var express = require('express');
var path = require('path');
var pwd = require('pwd');
var fs = require('fs');
var db = require('./lib/database');
var app = express();

// hmm.. list_id should be saved in a session var or sumpin
var realist = {
  "list_id" : "5271d178b457fbba75000002"
}

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'KJDNJ24SJFHDK433'}));
app.use(express.static(path.join(__dirname, 'public')));

// TODO: login check route

var io = require('socket.io').listen(app.listen(process.env.PORT || 9999));

// ------------------------------------------------------------------------------
// SOCKETS
// ------------------------------------------------------------------------------

io.sockets.on('connection', function(socket) {

  //socket.on('ready', function() {
    
    db.List.findOne({_id: realist.list_id}, function(err, list) {
      if (err) console.log(err);
      if (list) socket.emit('list loaded', list);
    });

    socket.on('list changed', function(data) {

      db.List.update({_id: realist.list_id}, {items: data}, { multi: true }, function(err) {
        if (err) console.log("list not saved");
      });

      socket.broadcast.emit('list saved', data);

    });

  // });

});
