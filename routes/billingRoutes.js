const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    //req.body is the parsed request body 
    //Check with middleware requireLogin if the user is logged in.
    //We can pass as many middlewares or funtions to express,
    //just make sure one of them they send a response back. 
    app.post('/api/stripe', requireLogin, async (req, res) => {
        //check if the user is logged in
        if (!req.user) {
            return res.status(401).send({ error: 'You must log in' });
        }

        //creating the actual charge. bill the credit card from stripe and say bill succesfully created.
        //stripe.charges is a method from npm stripe library
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 credits',
            source: req.body.id
        });
        //we are making a request to the user with req.user,
        // which is given to us by passport, give credits, save 
        // the credits to the database
        // and send the request back to the client.
        req.user.credits += 5;
        const user = await req.user.save();
        res.send(user);
    })
}