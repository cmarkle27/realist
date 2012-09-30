var connect = require('connect');
var http = require('http');
var io = require('socket.io');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect['static']('public'))
  .use(connect.directory('public'))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

var server = http.createServer(app);

// Listen for Socket.IO events
var ioApp = io.listen(server);

var messages = [];

var saveMessage = function(data) {
  messages.push(data);
};

ioApp
	.of('/addText')
	.on('connection', function(socket) {

    // loop over messages array
    messages.forEach(function(message) {
      console.dir(message);
      socket.emit('msg received', message.user, message.text);
    });

		socket.on('add text', function(data) {

      saveMessage(data);
			socket.broadcast.emit('msg received', data.user, data.text);
			socket.emit('msg received', data.user, data.text);
		});

	});

server.listen(8000, "192.168.1.116");


