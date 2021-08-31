const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('/api/surveys/thanks', (req, res) => {
        res.send('Thanks for voting!');
    });
}

module.exports = app => {
    app.post('/api/surveys', requireLogin, requireCredits, async(req, res) => {
       const { title, subject, body, recipients } = req.body;
    
        const survey = new Survey({
            title,
            subject,
            body,
            //trim() would cut out extra white spaces
            recipients: recipients.split(',').map(email => ({ email: email.trim() })), 
            _user: req.user.id,
            dateSent: Date.now(),
        });
        //First argument - survey
        //Everytime we want to send out an email it will have 
        //the properties from survey instance of a class object.
        //We pass it an amount of data as a configuration
        //Second argument - the actual body or content of the email intself.
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();
            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }
    }); 
};