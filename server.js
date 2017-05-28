var express = require('express');
var app = express();
var server = require('http').createServer(app),
    path = require('path');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');
var fs = require('fs');
var hbs = require('hbs');

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/jqs', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/assets', express.static(__dirname + '/app/views/assets'));
app.use('/hbs', express.static(__dirname + '/node_modules/handlebars/dist'));
hbs.registerPartials(__dirname + '/app/views/partials');

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
    extname: '.hbs',
    partialsDir: __dirname + '/app/views/partials'
}));
app.set('view engine', '.hbs');

app.use(function (req, res, next) {
    res.locals.logged = req.isAuthenticated();
    next();
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


app.listen(9090, (err) => {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});
