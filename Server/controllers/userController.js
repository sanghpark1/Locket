const models = require('../models/allModel');
const userController = {};

userController.getUser = (req, res, next) => {
    const { username } = req.body;
    models.User.findOne({ username }, (err, user) => {
        if (err) return next({log: 'error in GET request'})
        if (!user) {
            res.locals.getUser = null;
        } else {
            res.locals.getUser = user.username;
        }
        return next();
    })
}

userController.createUser = (req, res, next) => {
    if (res.locals.getUser === null) {
        const { username, password, name } = req.body;
        models.User.create({ username, name, password }, (err, user) => {
        res.locals.createUser = user;
        return next();
        })
    } else {
        res.locals.createUser = 'User already exists';
        return next();
    }
}

userController.loginUser = (req, res, next) => {
    const { username, password } = req.body;

    models.User.findOne({ username, password }, (err, user) => {
        if (err) return next({log: 'error in GET request'})
        if (!user) {
            res.locals.getUser = false;
        } else {
            console.log(user);
            res.locals.getUser = username;
        }
        return next();
    })
}

module.exports = userController;