const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// error below 
router.post('/signup', userController.getUser, userController.createUser, (req, res) => {
    return res.status(200).json(res.locals.createUser);
})

router.post('/login', userController.loginUser, (req, res) => {
    return res.status(200).json(res.locals.getUser);
})

module.exports = router;