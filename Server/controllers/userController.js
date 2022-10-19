const models = require('../models/userModel');
const userController = {};

userController.createUser = (req, res, next) => {
    const { username, password } = req.body;
    models.User.create({ username, password }, (err, user) => {
        res.locals.createUser = user;
        return next();
    })
}

module.exports = userController;