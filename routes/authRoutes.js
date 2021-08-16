const passport = require('passport');

module.exports = (app) => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
        //after user comes bach from auth flow, we authenticate and we tell the browser 
        //to go to the other route - surveys.
        (req, res) => {
            res.redirect('/surveys');
        }
    );

    // we made up a api/logout route name that whenever it get's accesed,
    // it will execute the function with incoming request and an outgoing response.
    app.get(
        '/api/logout', (req, res) => {
            
        req.logout();
        res.redirect('/');
    });

    app.get(
        '/api/current_user', (req, res) => {
        res.send(req.user);
    });
};

