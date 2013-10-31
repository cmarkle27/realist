var express = require('express');
var app = express();
var path = require('path');
var pwd = require('pwd');
var db = require('./lib/db');
var fs = require('fs');
var realist = {
  "index" : fs.readFileSync(__dirname + '/views/index.html', 'utf8'),
  "list_id" : null
}

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'KJDNJ24SJFHDK433'}));
app.use(express.static(path.join(__dirname, 'public')));
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

// routes
app.get('/login/:error?', function(req,res) {
	res.render('login', {
      title: "Login",
      hasError: req.params.error
	});
});

app.post('/login/:error?', function(req, res) {
  authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;
        res.redirect('/');
      });
    } else {
      res.redirect('/login/error');
    }
  });
});

// app.get('/list/:id', restrict, function(req,res) {
app.get('/list/:id', function(req, res) {

  realist.list_id = req.params.id;

  // console.log(req.session.user._id);

  res.set('Content-Type', 'text/html');
  res.send(realist.index);

});

app.get('/', function(req,res) {

    res.set('Content-Type', 'text/html');
    res.send(realist.index);

  // try?
  // db.Grocery.find(function(err, groceries) {
  //   if (err) console.log(err);
  //   res.render('index', {
  //     title: "List",
  //     groceries: groceries
  //   });
  // });

});

// sawkets

// this needs to only happen once
io.sockets.on('connection', function(socket) {

  console.log(realist.list_id);

  // this should be list instead of user!!!
  db.List.findOne({_id: realist.list_id}, function(err, list) {
    if (err) console.log(err);
    console.log(list);
    socket.emit('list loaded', list);
  });
  
  // socket.emit('message', { message: 'welcome to the chat' });
  // socket.on('send', function (data) {
  //     _ioServer.sockets.emit('message', data);
  // });

  socket.on('list changed', function(data) {

    console.log("\n ------------------------------------------------- \n list changed: ", data);

    db.List.update({_id: realist.list_id}, {items: data}, { multi: true }, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("list saved");
      }
    });

    // var item = new db.Grocery();
    // item.user = realist.list_id;
    // item.title = data.title;
    // item.checked = data.checked;

    // item.save(function(err) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("item saved");
    //   }
    // });

    // tell everyone else about our change
    socket.broadcast.emit('item saved', data);

  });

});

// start server
// app.listen(process.env.PORT || 8080);
