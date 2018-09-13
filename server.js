//List of NPM and inherent packages
var mysql = require("mysql");
require("dotenv").config();
var fs = require("fs");
var express = require('express');
var app = express();


// var router = express.Router();
var methodOverride = require('method-override');
// var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
var path = require("path");

app.use(methodOverride('_method'));
// app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static content for the app from the "public" directory in the application directory.
// you need this line here so you don't have to create a route for every single file in the public folder (css, js, image, etc)
//index.html in the public folder will over ride the root route
app.use(express.static("public"));

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
  if(req.body.username && req.body.picture_link){
      
    connection.query('INSERT INTO users (username, picture_link) VALUES (?, ?);', [req.body.username,req.body.picture_link],function(error, results, fields){
      
      if (error) throw error;
      res.render('pages/roommate_quiz.ejs');

    });
  }
  else{
    res.redirect('/');
  }     
});

app.listen(3000);