//we use a middleware to check if the user is logged in
//next passes the request to the next middleware in the chain
module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ error: 'You must log in!' });
    }
    next();
}