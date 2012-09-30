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
var id = 0;

var saveMessage = function(data) {
  console.log(data);
  messages.push(data);
};

ioApp
	.of('/addText')
	.on('connection', function(socket) {

    // loop over messages array
    messages.forEach(function(message) {
      socket.emit('msg received', message.user, message.text, message.checked, message.id);
    });

		socket.on('add text', function(data) {
      id += 1;
      data.id = id;
      saveMessage(data);
			socket.broadcast.emit('msg received', data.user, data.text, data.checked, data.id);
			socket.emit('msg received', data.user, data.text, data.checked, data.id);
		});

    socket.on('check', function(data) {
      console.log(data);
      messages.forEach(function(message, index) {
        console.log(message.id);
        if (message.id == data.id) { // and user
          messages[index].checked = data.checked; // mmm.. we need to replace this message in the messages array!!!

        }
      });
    });

	});

server.listen(8000, "192.168.1.113");


