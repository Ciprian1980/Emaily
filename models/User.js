const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String
});
//making a new collection named users
//2 arguments would load something into model
//1 argument would pull something from model
mongoose.model('users', userSchema); 