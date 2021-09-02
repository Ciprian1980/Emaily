//we use a middleware to check if the user is logged in
//next passes the request to the next middleware in the chain
module.exports = (req, res, next) => {
    //req, res representing the incoming request to our application
    if (!req.user) {
        return res.status(401).send({ error: 'You must log in!' });
    }
    next();
}