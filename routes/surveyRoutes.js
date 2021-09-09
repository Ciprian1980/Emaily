const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
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

  //extracting just the url and surveyId and choice
  app.post('/api/surveys/webhooks', (req, res) => {
    console.log(req.body)
    const events = _.map(req.body, (event) => {
      //out of entire url, we take only '/api/surveys/5971/yes'.
      const pathname = new URL(event.url).pathname; 
      //extracting the surveyId and choice out of the path.
      const p = new Path('/api/surveys/:surveyId/:choice');
      const match = p.test(pathname);
      console.log(match)
      //if there is a match, return just the email, surveyId and the choice.
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice };
      }
    })
    //we iterate over the events with lodash function - compact,
    //which iterates over the array and removes all elements that are undefined.
    const compactEvents = _.compact(events);
    
    //_.uniqBy is another lodash function that iterates over the array 
    //compactEvents and if they find email and surveyId duplicates, it removes them.
    //the user can't vote twice - with same email on the same survey.
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
    //console.log(uniqueEvents);
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