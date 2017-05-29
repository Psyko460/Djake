var authController = require('../controllers/authcontroller.js');
var torrentController = require('../controllers/torrentController.js');
var fs = require('fs');
var path = require("path");
var fileName = path.join(__dirname, '..', 'config', 'configTorrent.json')
var config = require(path.join(__dirname, '..', 'config', 'configTorrent.json'));

module.exports = function(app, passport) {

    app.get('/inscription', notLoggedIn, authController.signup);
    app.get('/connexion', notLoggedIn,authController.signin);
    app.get('/',notLoggedIn, authController.index);
    app.get('/logout', isLoggedIn, authController.logout);
    app.get('/dashboard',isLoggedIn, authController.dashboard);
    app.get('/options',isLoggedIn, authController.options);
    app.get('/informations', notLoggedIn, authController.informations);
    app.get('/profil', isLoggedIn, authController.profil );


    app.post('/resultat', torrentController.searchTorrent); //recherche des torrents
    app.post('/download/:{{result}}', torrentController.downloadTorrent);

    app.post('/registerUser', isLoggedIn, authController.profilEdit);

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

    app.post('/registerProvider/:name', (req, res) => {
      providerName = req.params.name;
      config[providerName].username = req.body['login'+providerName]
      config[providerName].password = req.body['password'+providerName]
      fs.writeFile(fileName, JSON.stringify(config), (err) => {
        if (err) return console.log(err);
      });
      res.redirect('/options');
    })

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
