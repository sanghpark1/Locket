require('dotenv').config();
const models = require('../models/allModel');
const jwt = require('jsonwebtoken');

const entryController = {};

entryController.getEntries = (req, res, next) => {
    const { username } = req.user;
    models.Entry.find({ username }, 'date', (err, datesArr) => {
        if (err) return next({ log: 'Error in getEntries' });
        res.locals.getEntries = datesArr;
        console.log(datesArr);
        return next();
    })
}

entryController.getSingle = (req, res, next) => {
    const { username } = req.user;
    const { date } = req.body;
    models.Entry.findOne({ username, date }, 'content', (err, single) => {
        if (err) return next({ log: err });
        res.locals.getSingle = single;
        console.log(single);
        return next();
    })
}

entryController.createNew = (req, res, next) => {
    console.log('content: ', res.locals.getSingle);
    if (res.locals.getSingle) {
        res.locals.createEntry = 'Today\'s journal has already been submitted.';
        return next();
    }

    const { username } = req.user;
    const { content, date } = req.body;
    models.Entry.create({ username, content, date }, (err, entry) => {
    if (err) return next({ log: err })
    res.locals.createEntry = entry;
    console.log(entry);
    return next();
    })
}

entryController.updateSingle = (req, res, next) => {
    const { username } = req.user;
    const { date, content } = req.body;
    console.log(username, date, content);
    models.Entry.findOneAndUpdate({ username, date }, { content }, (err, updatedSingle) => {
        if (err) return next({ log: err });
        res.locals.updateSingle = updatedSingle;
        return next();
    })
}

entryController.deleteSingle = (req, res, next) => {
    const { username } = req.user;
    const { date } = req.body;
    console.log(username, date);
    models.Entry.findOneAndDelete({ username, date }, (err, deletedSingle) => {
        if (err) return next({ log: err });
        res.locals.deleteSingle = deletedSingle;
        return next();
    })
}

entryController.authenticateToken = async (req, res, next) => {
    const token = req.cookies.ssid;
    if (token == null) return res.sendStatus(404);

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return next({ log: 'Error in jwt verification' });
            console.log('user:', user);
            req.user = user;
            return next();
        });
    } catch (err) {
        return next({ log: 'error in authenticateToken' });
    }
}

module.exports = entryController;