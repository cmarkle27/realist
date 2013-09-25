var express = require('express');
var app = express();
var path = require('path');
var pwd = require('pwd');
var db = require('./lib/db');

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

// route with restrict middleware
// add list items to template

//app.get('/', restrict, function(req,res) {
app.get('/', function(req,res) {

	// try?
	db.Grocery.find(function(err, groceries) {
	  if (err) console.log(err);
		res.render('index', {
		    title: "List",
		    groceries: groceries
		});
	});

});

// start server
app.listen(process.env.PORT || 8080);