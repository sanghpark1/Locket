const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/checkLogStatus', userController.checkLogStatus, (req, res) => {
    return res.status(200).json(res.locals.checkLogStatus);
})

router.get('/logOut', userController.logOut, (req, res) => {
    return res.status(200).json(res.locals.loggedOutAttempt);
})

router.post('/signup', userController.bcryptPassword, userController.getUser, userController.createUser, (req, res) => {
    return res.status(200).json(res.locals.createUser);
})

router.post('/login', userController.getUser, userController.loginUser, (req, res) => {
    console.log(res.locals.getUser);
    return res.status(200).json(res.locals.yayOrNay);
})

module.exports = router;

