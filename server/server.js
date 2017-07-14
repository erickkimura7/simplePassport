const express= require("express");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require("path");
const publicPath = path.join(__dirname, '..', '/public');
const _ = require("lodash");
const bodyparser = require('body-parser');
// DB - conexao 
const mongoose = require("./db/mongoose");

// DB - model
const {Users} = require("./db/users");


// configure passport
passport.use(new LocalStrategy(
	function(login,password , callback){
		Users.find().then((err,result) => {
			console.log(result);
		});
		console.log("login");
		Users.findByLogin(login , function(err,user){
			if(err){
				console.log("ERoo");
				return callback(err);
			}
			if(!user){
				console.log("usuario nao encontrado");
				return callback(null,false);
			}
			console.log("User pass : ",user.senha);
			console.log("Pass : ",password);
			if(user.senha != password){
				console.log("senha errada");
				return callback(null,false);
			}
			console.log("foi ",user)
			return callback(null,user);

		});
	}
));

passport.serializeUser(function(user, cb) {
	console.log("serialize");
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	console.log("deserializeUser");
  Users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

const app = express();

// setup mid
app.use(express.static(publicPath));
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// init passport

app.use(passport.initialize());
app.use(passport.session());

// routes
app.get('/', function(req,res){
	res.send("Home");
});

app.post('/', function(req,res){
	console.log(req.body);
	var body = _.pick(req.body,['login','nome','senha']);
	var user = new Users(body);
	user.save().then((doc) => {
		console.log("saved" , doc);
	}).catch((e) => {
		console.log(e);
	});

});

app.get('/login', function(req,res){
	res.sendfile(publicPath+"/login.html");
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login.html' }),
  function(req, res) {
    res.redirect('/menu');
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/menu',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.sendfile(publicPath+"/menu.html");
  });

app.listen(3000);