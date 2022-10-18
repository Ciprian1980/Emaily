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
  app.delete('/api/surveys/delete', requireLogin, async (req, res) => {
    const deleteSurvey = await Survey.find({ _user: req.user.id });
    res.send(deleteSurvey);
  })


  //user has to be logged in, we reach in database and find all queries
  //made by the _user and specify that we do not want to include the recipient field.
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });

    res.send(surveys);
  });

 app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });
  //return a list of surveys created by the current user.
 //extracting just the url and surveyId and choice
 //iterate over req.body, we map over it, we compact it, 
 //run uniqueBy to take out duplicates and return the value();
 //we iterate over the events with lodash function - compact,
 //which iterates over the array and removes all elements that are undefined.
 //_.uniqBy is another lodash function that iterates over the array.

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');
    
    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
    })
    .compact()
    .uniqBy('email', 'surveyId')
    //Look on the Survey collection, find and update exactly one record in that collection.
    //we want to find the survey with that given id. We want to find and recipient
    //with that given email, that has not responded yet to the survey.
    //After this survey has been found, do the following to it:
    //increment the choice by 1 and update the recipient we have found and update the responded prop to true.
    //Recipients was found in SurveyId. We access with $ the responded property on the recipients that was found in $elemMatch.
    //We need to write _id for Mongo, not just id.
    .each(({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
        //finding the survey. $ is a mongo operator
        _id: surveyId,
        recipients: {
          $elemMatch: { email: email, responded: false },
        },
      }, 
      {
        //We update the survey. [choice] - [] key interpolation.
        $inc: { [choice]: 1 },
        $set: { 'recipients.$.responded': true },
        lastResponded: new Date(),
      }
      ).exec();
    })
    .value();
    console.log(req.body)
    res.send({});
  });

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
        .map(email => ({ email: email.trim() })),
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