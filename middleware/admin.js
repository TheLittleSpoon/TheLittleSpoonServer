// This middleware checks whether this user is an admin.
module.exports = function (req, res, next) {
    if(!req,user.isAmdin) return res.status(403).send('Access denied.');
    next();
}