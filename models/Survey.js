const mongoose = require('mongoose');
const { Schema } = mongoose;
const  RecipientSchema = require('./Recipient');

const surveySchema = new Schema ({
    title: String,
    subject: String,
    body: String,
    recipients: [RecipientSchema],//array of recipient records
     yes: { type: Number, default: 0 },
     no: { type: Number, default : 0 },
     delete: String,
     //every survey is going to belong to a very particular user
     //The ObjectId reference to 'User' collection
     _user: { type: Schema.Types.ObjectId, ref: 'User' }, 
     dateSent: Date,
     lastResponded: Date
})
mongoose.model('surveys', surveySchema)