var express = require('express');
var app = express();
var server = require('http').createServer(app),
    path = require('path');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');

app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use('/css', express.static(__dirname + '/node_modules/bootstrap-v4-dev/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-v4-dev/dist/js'));
app.use('/jqs', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/assets', express.static(__dirname + '/app/views/assets'));


//BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


//Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');



app.get('/', function(req, res) {
    res.render('index');
});

//Models
var models = require("./app/models");

//Routes

var authRoute = require('./app/routes/auth.js')(app,passport);


//load passport strategies

require('./app/config/passport/passport.js')(passport, models.user);


//Sync Database

models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});


app.listen(9090, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});