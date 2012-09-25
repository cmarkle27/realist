var connect = require('connect'),
	http = require('http'),
	io = require('socket.io');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect['static']('public'))
  .use(connect.directory('public'))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

var server = http.createServer(app);

/*server.use('/',
    connect.router(function(app) {
        app.get('', handleGet);
        //app.post('', handlePost);
    })
);*/

// Listen for Socket.IO events
var ioApp = io.listen(server);

ioApp
	.of('/addText')
	.on('connection', function(socket) {
		socket.on('add text', function(data) {
			console.log(data.user + ": " + data.text);
      //sahkdf aksdh akds
			socket.broadcast.emit('msg received', data.user, data.text);
			socket.emit('msg received', data.user, data.text);
		});
	});

server.listen("http://markle976.realist.jit.su");


