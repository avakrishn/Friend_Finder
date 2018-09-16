//List of NPM and inherent packages
var mysql = require("mysql");
require("dotenv").config();
var fs = require("fs");
var express = require('express');
var app = express();

var validUrl = require('valid-url');


// var router = express.Router();
var methodOverride = require('method-override');
// var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require("path");

app.use(methodOverride('_method'));
app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static content for the app from the "public" directory in the application directory.
// you need this line here so you don't have to create a route for every single file in the public folder (css, js, image, etc)
//index.html in the public folder will over ride the root route

app.use(express.static("app/public"));

//sets EJS available
// app.set('view engine', 'ejs');

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  
  // Your port; if not 3306
  port: 3306,
  
  // Your username
  user: process.env.DB_USER,
  
  // Your password
  password: process.env.DB_PASSWORD,  //placeholder for your own mySQL password that you store in your own .env file
  database: process.env.DB_NAME    //TBD

  
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'app/public/index.html'));
});


app.post('/create_user', function(req, res){
  console.log(req.body);
  // console.log(validUrl.isWebUri(req.body.picture_link));

  // if the user has filled in a picture link that is a valid url
  if( validUrl.isWebUri(req.body.picture_link)){
      
    connection.query('INSERT INTO users (username, picture_link) VALUES (?, ?);', [req.body.username,req.body.picture_link],function(error, results, fields){
      
      if (error) throw error;

        // selects the last id of the user that was inserted into the user table
        connection.query('SELECT LAST_INSERT_ID() as id;', function(error, results, fields){
      
          if (error) throw error;
          console.log(results[0].id);
          req.session.users_id = results[0].id;
          console.log(req.session.users_id);
          res.redirect('/roommate_quiz');
  
        });  

    });
  }
  // if user has left fields blank redirect user back to root
  else{
    res.redirect('/');
  }     
});

app.get('/roommate_quiz', function(req, res) {
  if(req.session.users_id){

      res.render(__dirname + '/app/views/pages/roommate_quiz.ejs');
  }
  else{
    res.redirect('/');
  }
});


app.post('/submit_q', function(req, res){
  console.log(req.session.users_id);
  
    connection.query('INSERT INTO user_answers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [req.session.users_id, req.body.q_1, req.body.q_2, req.body.q_3, req.body.q_4, req.body.q_5, req.body.q_6, req.body.q_7, req.body.q_8, req.body.q_9, req.body.q_10],function(error, results, fields){
      
      if (error) throw error;
      res.redirect('/results');

    });    
});

app.get('/results', function(req, res){
  if(req.session.users_id){

    res.render(__dirname + '/app/views/pages/results.ejs');
  }
  else{
    res.redirect('/');
  }
    
});

app.get('/potential_roommates', function(req, res){
  connection.query('SELECT * FROM user_answers WHERE NOT users_id = ?;',[req.session.users_id], function(error, results, fields){
      
    if (error) throw error;
    res.json(results);

  });
    
});

app.get('/user', function(req, res){
  connection.query('SELECT * FROM user_answers WHERE users_id = ?;',[req.session.users_id], function(error, results, fields){
      
    if (error) throw error;
    res.json(results);

  });
    
});

app.get('/perfect_roommates', function(req, res){

  connection.query('SELECT * FROM users WHERE id IN (?);',[req.query.userID], function(error, results, fields){
      
    if (error) throw error;
    res.json(results);

  });
    
});


app.listen(3000);