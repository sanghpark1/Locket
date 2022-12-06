const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');

router.get('/getEntries', entryController.authenticateToken, entryController.getEntries, (req, res) => {
    return res.status(200).json(res.locals.getEntries);
})

router.post('/getSingle', entryController.getSingle, (req, res) => {
    return res.status(200).json(res.locals.getSingle);
})

router.post('/new', entryController.getSingle, entryController.createNew, (req, res) => {
    return res.status(200).json(res.locals.createEntry);
})

router.post('/update', entryController.authenticateToken, entryController.updateSingle, (req, res) => {
    return res.status(200).json(res.locals.updateSingle);
})

router.post('/delete', entryController.authenticateToken, entryController.deleteSingle, (req, res) => {
    return res.status(200).json(res.locals.deleteSingle);
})

module.exports = router;