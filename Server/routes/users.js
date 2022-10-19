const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/", (req, res) => {
    res.json('Hello and success from Project Solo GET request')
});

router.post('/', userController.createUser, (req, res) => {
    console.log(req.body);
    return res.status(200).json(res.locals.createUser)
})

module.exports = router;