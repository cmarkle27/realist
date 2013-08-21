var express = require('express');
var app = express();
var path = require('path');
var pwd = require('pwd');
var db = require('./lib/db');

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'KJDNJ24SJFHDK433'}));
app.use(express.static(path.join(__dirname, 'public')));

// stuff
function authenticate(name, pass, fn) {
  db.User.findOne ({username: name}, function(err, user) {
    if (!user) return fn(new Error('cannot find user'));
    pwd.hash(pass, user.salt, function(err, hash){
      if (err) return fn(err);
      if (hash == user.hash) return fn(null, user);
      fn(new Error('invalid password'));
    })
  })
}

// middleware
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

// routes
app.get('/login', function(req,res) {
	res.sendfile('views/login.html');
});

app.post('/login', function(req, res){
  console.log(req.body);
  authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;
        res.redirect('/');
      });
    } else {
      res.redirect('login');
    }
  });
});

// route with restrict middleware
app.get('/', restrict, function(req,res) {
	res.sendfile('views/index.html');
});






// var auth = express.basicAuth(function(user, pass) {
// 	if (user === 'demo' && pass === 'demo') {
// 		return true;
// 	}
// });


// app.get('/awesome', auth, function(req, res) {
// 	var message = "Your Awesome.";
// 	if (req.session.lastPage) {
// 		message += 'Last page was: ' + req.session.lastPage + '. ';
// 	}
// 	req.session.lastPage = '/awesome';
//  	res.send(message);
// });

// app.get('/', auth, function(req,res) {
// 	// check login...
// 	res.sendfile('views/index.html');
// });



// app.get(/^(.+)$/, function(req, res) { 
// 	res.sendfile('public/' + req.params[0]);
// });

//If you host the application on Modulus the PORT environment variable will be defined,
//otherwise I’m simply using 8080.
app.listen(process.env.PORT || 8080);