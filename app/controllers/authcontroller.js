var path = require("path");
var config = require(path.join(__dirname, '..', 'config', 'config.json'));

var exports = module.exports = {};

exports.index = function(req, res) {
    res.render('index');
};

exports.informations = function(req, res) {
    res.render('informations');
};

exports.signup = function(req, res) {
    res.render('signup');
};

exports.signin = function(req, res) {
    res.render('signin');
};

exports.dashboard = function(req, res) {
    res.render('dashboard');
};

exports.profil = function(req, res) {
    res.render('profil');
};

exports.options = function(req, res) {
    res.render('options', {usernameT411: config.t411.username, passwordT411: config.t411.password, usernameTransmission: config.transmission.username, passwordTransmission: config.transmission.password, hostTransmission: config.transmission.hostPort});
};

exports.profilEdit = function(req, res){
    var User = user;
      User.update({_id: req.session.passport.user.id}, {
        username : req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      }),
      res.redirect('/dashboard')
  };

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
};
