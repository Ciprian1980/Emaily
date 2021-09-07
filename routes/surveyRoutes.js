const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
 
const Survey = mongoose.model('surveys');
 
module.exports = app => {
 //return a list of surveys created by the current user
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    console.log(req.body);
    res.send({});
  })

 //create a new survey. Make sure the user is logged in and has enough credits.
  //req, res representing the incoming request to our application
  //all the info incoming to req exists on the body of the object, which is req.body
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    //create a subdocument schema
    const survey = new Survey({
      title,
      subject,
      body,
      //trim() would cut out extra white spaces
      recipients: recipients
        .split(',')
        .map(email => ({ email })),
      _user: req.user.id,
      dateSent: Date.now()
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