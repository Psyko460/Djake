var authController = require('../controllers/authcontroller.js');
var t411Controller = require('../controllers/t411controller.js');
var fs = require('fs');
var path = require("path");
var fileName = path.join(__dirname, '..', 'config', 'config.json')
var config = require(path.join(__dirname, '..', 'config', 'config.json'));

module.exports = function(app, passport) {

    app.get('/inscription', notLoggedIn, authController.signup);
    app.get('/connexion', notLoggedIn,authController.signin);
    app.get('/',notLoggedIn, authController.index);
    app.get('/logout', isLoggedIn, authController.logout);
    app.get('/dashboard',isLoggedIn, authController.dashboard);
    app.get('/options',isLoggedIn, authController.options);
    app.get('/informations', notLoggedIn, authController.informations);
    app.get('/profil', isLoggedIn, authController.profil );


    app.get('/resultat', t411Controller.t411Result); //tests
    app.post('/searchT411', t411Controller.searchT411);

    app.post('/registerUser/{{id}}', isLoggedIn, authController.profilEdit);

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/inscription'
        }
    ));

    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/dashboard',
            failureRedirect: '/connexion'
        }
    ));



    app.post('/registerT411', (req, res) => {
      if(req.body.loginT411 != null && req.body.passwordT411 != null ) {
        config.t411.username = req.body.loginT411;
        config.t411.password = req.body.passwordT411;
        fs.writeFile(fileName, JSON.stringify(config), (err) => {
          if (err) return console.log(err);
        });
      }
      res.redirect('/options');
    });

    app.post('/registerTransmission', (req, res) => {
      if(req.body.loginTransmission != null && req.body.passwordTransmission != null && req.body.hostTransmission != null ) {
        config.transmission.username = req.body.loginTransmission;
        config.transmission.password = req.body.passwordTransmission;
        config.transmission.hostPort = req.body.hostTransmission;
        fs.writeFile(fileName, JSON.stringify(config), (err) => {
          if (err) return console.log(err);
        });
      }
      res.redirect('/options');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/connexion');
    }

    function notLoggedIn(req, res, next) {
        if (!req.isAuthenticated())
            return next();
        res.redirect('/dashboard');
    }

};
