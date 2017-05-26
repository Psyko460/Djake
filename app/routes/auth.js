var authController = require('../controllers/authcontroller.js');

module.exports = function(app, passport) {

    app.get('/inscription', authController.signup);
    app.get('/connexion', authController.signin);
    app.get('/logout',isLoggedIn, authController.logout);
    app.get('/accueil',authController.index);

    app.get('/dashboard',isLoggedIn, authController.dashboard);




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

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/connexion');
    }

};
