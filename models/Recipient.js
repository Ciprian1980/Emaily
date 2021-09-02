//recipient is a sub document collection of the survey model
const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
    email: String,
    //if the user clicked on the button
    responded: { type: Boolean, default: false }
});

module.exports = recipientSchema;