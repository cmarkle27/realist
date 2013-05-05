var connect = require('connect');
var http = require('http');
var io = require('socket.io');
var fs = require('fs');
var nconf = require('nconf');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect['static']('public'))
  .use(connect.directory('public'))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

var items = [];
var id = 0;

var saveMessage = function(data) {
  id += 1;
  data.id = id;
  items.push(data);
  console.dir(data);
};

var server = http.createServer(app);
var ioApp = io.listen(server);

nconf
  .argv()
  .file({file:'./config.json'});

ioApp
	.of('/realist')
	.on('connection', function(socket) {

    items.forEach(function(message) {
      socket.emit('item added', message.user, message.text, message.checked, message.id);
    });

		socket.on('add item', function(data) {
      saveMessage(data);
			socket.broadcast.emit('item added', data.user, data.text, data.checked, data.id);
			socket.emit('item added', data.user, data.text, data.checked, data.id);
		});

    socket.on('check item', function(data) {
      Object.keys(items).forEach(function(key) {
        if (items[key].id === data.id) { // and user
          items[key].checked = data.checked;
        }
      });
    });

	});
if (nconf.get("port") === "") {
  server.listen(nconf.get("address"));
} else {
  server.listen(nconf.get("port"), nconf.get("address"));
}
console.log("server started at:", nconf.get("address") + ":" + nconf.get("port"));
