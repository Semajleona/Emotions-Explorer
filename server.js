// server.js

// SET UP =====================================================

// Load environment variables
require('dotenv').config({ path: './config/.env' });

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

var db;


// CONFIGURATION ===============================================

// Connect to MongoDB
mongoose.connect(configDB.url, { dbName: configDB.dbName }, (err, database) => {

  if (err) {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  }

  db = mongoose.connection.db;

  console.log('Database connected:', mongoose.connection.name);

  // Load routes after database connects
  require('./app/routes.js')(app, passport, db);

});


// PASSPORT ===================================================

require('./config/passport')(passport);


// EXPRESS SETTINGS ===========================================

app.use(morgan('dev'));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');


// SESSION ====================================================

app.use(session({
  secret: process.env.SESSION_SECRET || 'rcbootcamp2021b',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());


// START SERVER ===============================================

app.listen(port, '0.0.0.0', () => {
  console.log('The magic happens on port ' + port);
});
