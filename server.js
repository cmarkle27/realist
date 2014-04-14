var express = require('express');
var path = require('path');
var pwd = require('pwd');
var fs = require('fs');
var db = require('./lib/db');
var app = express();

// hmm.. list_id should be saved in a session var or sumpin
var realist = {
  "index" : fs.readFileSync(__dirname + '/views/index.html', 'utf8'),
  "list_id" : "5271d178b457fbba75000002"
}

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'KJDNJ24SJFHDK433'}));
app.use(express.static(path.join(__dirname, 'public')));

// we should just do the login on the same page and get rid of ejs
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

function authenticate(name, pass, fn) {
  db.User.findOne({username: name}, function(err, user) {
    if (!user) return fn(new Error('cannot find user'));
    pwd.hash(pass, user.salt, function(err, hash){
      if (err) return fn(err);
      if (hash == user.hash) return fn(null, user);
      fn(new Error('invalid password'));
    })
  })
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

var io = require('socket.io').listen(app.listen(process.env.PORT || 8080));

// ------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------

// app.get('/login/:error?', function(req,res) {
// 	res.render('login', {
//       title: "Login",
//       hasError: req.params.error
// 	});
// });

// app.post('/login/:error?', function(req, res) {
//   authenticate(req.body.username, req.body.password, function(err, user){
//     if (user) {
//       req.session.regenerate(function(){
//         req.session.user = user;
//         res.redirect('/');
//       });
//     } else {
//       res.redirect('/login/error');
//     }
//   });
// });

// app.get('/list/:id', restrict, function(req,res) {
// app.get('/list/:id', function(req, res) {
//   realist.list_id = req.params.id;
//   res.set('Content-Type', 'text/html');
//   res.send(realist.index);
// });

// app.post('/list/:id', function(req, res) {
//   realist.list_id = req.params.id;
//   res.set('Content-Type', 'text/html');
//   res.send(realist.index);
// });

app.get('/', function(req,res) {
    res.set('Content-Type', 'text/html');
    res.send(realist.index);
});

app.get('/foos', function(req,res) {
    res.set('Content-Type', 'text/html');
    res.send("<b>PATRY</b>");
});

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
        if (err) console.log("list saved");
      });

      socket.broadcast.emit('list saved', data);

    });

  // });

});
