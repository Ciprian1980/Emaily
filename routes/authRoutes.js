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
        passport.authenticate('google')
    );

    // we made up a api/logout route name that whenever it get's accesed,
    // it will execute the function with incoming request and an outgoing response.
    app.get(
        '/api/logout', (req, res) => {
            
        req.logout();
        res.send(req.user);//the screen will be empty because we took out the if from user by invoking logout()
    });

    app.get(
        '/api/current_user', (req, res) => {
        res.send(req.user);
    });
};

