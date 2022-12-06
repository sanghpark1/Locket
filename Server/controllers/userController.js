require('dotenv').config();
const models = require('../models/allModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {};

userController.checkLogStatus = async (req, res, next) => {
    const token = req.cookies.ssid;
    if (token == null) {
        res.locals.checkLogStatus = false;
        return next();
    };

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return next({ log: 'Error in checkLog jwt verification' });
            res.locals.checkLogStatus = 'success';
            return next();
        });
    } catch (err) {
        return next({ log: 'error in checkLog', message: 'user not signed in' });
    }
}

userController.getUser = (req, res, next) => {
    const { username } = req.body;
    models.User.findOne({ username }, 'username password', (err, user) => {
        if (err) return next({log: 'error in GET request'})
        if (!user) {
            res.locals.getUser = null;
        } else {
            res.locals.getUser = user.username;
            res.locals.getPassword = user.password;
            console.log('user: ', user);
        }
        return next();
    })
}

userController.createUser = (req, res, next) => {
    if (res.locals.getUser === null) {
        const { username, name } = req.body;
        const { hashedPw: password } = res.locals;
        models.User.create({ username, name, password }, (err, user) => {
        res.locals.createUser = user;
        return next();
        })
    } else {
        res.locals.createUser = 'User already exists';
        return next();
    }
}


userController.bcryptPassword = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(req.body.password, salt);
        res.locals.hashedPw = hashed;
        return next();
    } catch (err) {
        return next({ log: error in bcrypt, err })
    }
}

userController.loginUser = async (req, res, next) => {
    if (res.locals.getUser === null) {
        res.locals.yayOrNay = false;
        return next();
    }
    try {
       
        if (await bcrypt.compare(req.body.password, res.locals.getPassword)) {
            const user = { username: req.body.username };
            console.log('user:', user);
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.locals.yayOrNay = { logAttempt: 'success', username: res.locals.getUser};
            console.log('accessToken', accessToken);
            res.cookie('ssid', accessToken, {
                httpOnly: true
            });
            res.cookie('username', req.body.username, {
                httpOnly: true
            });
        } else {
            res.locals.yayOrNay = false;
        }
        return next();
    } catch (err) {
        return next({ log: 'error in bcrypt', err })
    }
}

userController.logOut = (req, res, next) => {
    res.cookie('ssid', 'NoThankYou', {
        httpOnly: true
    });
    res.cookie('username', 'NoThankYou', {
        httpOnly: true
    });
    res.locals.loggedOutAttempt = 'Logged Out Successfully';
    return next();
}

module.exports = userController;