var authController = require('../controllers/authcontroller.js');
var fs = require('fs');
var path = require("path");
var fileName = path.join(__dirname, '..', 'config', 'config.json')
var config = require(path.join(__dirname, '..', 'config', 'config.json'));

module.exports = function(app, passport) {

    app.get('/inscription', authController.signup);
    app.get('/connexion', authController.signin);
    app.get('/logout',isLoggedIn, authController.logout);
    app.get('/accueil',authController.index);
    app.get('/dashboard',isLoggedIn, authController.dashboard);
    app.get('/options',isLoggedIn, authController.options);
    app.get('/informations', authController.informations);



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
      // req.body.login & req.body.password
      if(req.body.loginT411 != null && req.body.passwordT411 != null ) {
        config.t411.username = req.body.loginT411;
        config.t411.password = req.body.passwordT411;
        fs.writeFile(fileName, JSON.stringify(config), function (err) {
          if (err) return console.log(err);
          console.log(JSON.stringify(config));
          console.log('writing to ' + fileName);
        });
      }
      res.redirect('/options');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/connexion');
    }

};
