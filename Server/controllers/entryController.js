const models = require('../models/allModel');
const entryController = {};

entryController.getEntries = (req, res, next) => {
    const { username } = req.body;
    models.Entry.find({ username }, 'date', (err, datesArr) => {
        if (err) return next({ log: err });
        res.locals.getEntries = datesArr;
        console.log(datesArr);
        return next();
    })
}

entryController.getSingle = (req, res, next) => {
    const { username, date } = req.body;
    models.Entry.findOne({ username, date }, 'content', (err, single) => {
        if (err) return next({ log: err });
        res.locals.getSingle = single;
        console.log(single);
        return next();
    })
}

entryController.createNew = (req, res, next) => {
    const { username, content, date } = req.body;
    models.Entry.create({ username, content, date }, (err, entry) => {
    if (err) return next({ log: err })
    res.locals.createEntry = entry;
    console.log(entry);
    return next();
    })
}

entryController.updateSingle = (req, res, next) => {
    const { username, date, content } = req.body;
    console.log(username, date, content);
    models.Entry.findOneAndUpdate({ username, date }, { content }, (err, updatedSingle) => {
        if (err) return next({ log: err });
        res.locals.updateSingle = updatedSingle;
        return next();
    })
}

entryController.deleteSingle = (req, res, next) => {
    const { username, date } = req.body;
    console.log(username, date);
    models.Entry.findOneAndDelete({ username, date }, (err, deletedSingle) => {
        if (err) return next({ log: err });
        res.locals.deleteSingle = deletedSingle;
        return next();
    })
}

module.exports = entryController;