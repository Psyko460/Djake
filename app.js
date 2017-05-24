var express = require('express');
var app = express();
var server = require('http').createServer(app),
    path = require('path');
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'toosecretforya',resave: true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap-v4-dev/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-v4-dev/dist/css'));
app.use('/css', express.static(__dirname + '/views/css'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});


//Models
var models = require("./app/models");

//Routes
var authRoute = require('./app/routes/auth.js')(app);

//Sync Database
models.sequelize.sync().then(function() {

    console.log('Nice! Database looks fine')

}).catch(function(err) {

    console.log(err, "Something went wrong with the Database Update!")

});

server.listen(9090, (err) =>{
  if (!err) {
    console.log('Application disponible localhost:9090');
  }else{
    console.log(err)
  }
});
