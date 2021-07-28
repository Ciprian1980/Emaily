//passport file handles the serialisation and deserialisation of the user id inside the cookie
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys.js');
const mongoose = require('mongoose');

const User = mongoose.model('users');//pulling users model 

//we are serializing with passport the user.
passport.serializeUser((user, done) => {
    //we are serializing the id of the user in the database - assigned by mongo (user model instance id), 
    //not the google auth id(profile.id)
    done(null, user.id); 
})
//we are taking the serialized user and turn it back into a model
//we get first whatever it's in the cookie, which is the id. 
//Second argument done, which we call after we turned the id into a user.
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
}, 
    (accessToken, refreshToken, profile, done) => {
        //we search for profile id 
        User.findOne({ googleId: profile.id })
        .then((existingUser) => {
            console.log(existingUser)
            if(existingUser) {
                //we have already an existing user with given profile id
                //we call done if we found the user.null - we are finished here, existingUser - here is the user.
                done(null, existingUser) 
                
            } else {
                //we don't have a user with this profile id 
                //creating a new instance of user that has google Id and on the profile we extract the id
                new User({ googleId: profile.id })
                .save() //saving the instance from mongoose into mongoDB
                //getting back the final user from database
                .then(user => done(null, user));
            }
        })
    }
));