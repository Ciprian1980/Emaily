const sendgrid = require('sendgrid');
const helper = sendgrid.mail; //or { mail }
const keys = require('../config/keys');

//We set up a configuration of mail as the way sendGrid would require.
//helper.Mail is an object that does a lot of configuration and spits out a mailer
class Mailer extends helper.Mail {
    //content is the html link we got from surveyTemplate(survey) 
    constructor({ subject, recipients }, content) {
        super();//helper.Mail gets executed when we call super()

        this.sgApi = sendgrid(keys.sendGridKey);
        this.from_email = new helper.Email('cippopa@gmail.com');//whos is sending email
        this.subject = subject; //subject of email
        this.body = new helper.Content('text/html', content); //helper func from sendGrid library to help work properly the email and body in an email.
        //this.recipients is the array of recipients from formatAddresses(recipients)
        this.recipients = this.formatAddresses(recipients); //who the email should be send to
    
        //helper.Mail has built in functionality and addContent is one of it.
        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients();
    }

    formatAddresses(recipients) {
        //we take each email from recipients
        return recipients.map(({ email }) => { 
            //we format the email with the helper
            return new helper.Email(email);
        });
    }
    //sendGrid scans the email and replaces every link with their own special one.
    addClickTracking(){
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);

        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }
    addRecipients() {
        const personalize = new helper.Personalization();
        //recipient is the return value of helper.Email(email)
        //and added to personalize object.
        this.recipients.forEach(recipient => {
            personalize.addTo(recipient);
        });
        //addPersonalization() is function given to us by Mail base class
        this.addPersonalization(personalize);
    }
    //send function to send the Mailer to sendGrid
    async send() {
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: this.toJSON()
        });
        const response = await this.sgApi.API(request);
        return response;
    }
}

module.exports = Mailer;