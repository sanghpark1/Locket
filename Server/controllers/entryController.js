require('dotenv').config();
const models = require('../models/allModel');
const jwt = require('jsonwebtoken');

const entryController = {};

entryController.getEntries = (req, res, next) => {
  const { username } = req.cookies;
  models.Entry.find({ username }, 'date', (err, datesArr) => {
    if (err) return next({ log: 'Error in getEntries' });
    res.locals.getEntries = datesArr;
    return next();
  });
};

entryController.getSingle = (req, res, next) => {
  const { username } = req.cookies;
  const { date } = req.body;
  models.Entry.findOne({ username, date }, 'content', (err, single) => {
    if (err) return next({ log: err });
    res.locals.getSingle = single;
    return next();
  });
};

entryController.createNew = (req, res, next) => {
  if (res.locals.getSingle) {
    res.locals.createEntry = "Today's journal has already been submitted.";
    return next();
  }

  const { username } = req.cookies;
  const { content, date } = req.body;
  models.Entry.create({ username, content, date }, (err, entry) => {
    if (err) return next({ log: err });
    res.locals.createEntry = 'Submitted!';
    return next();
  });
};

entryController.updateSingle = (req, res, next) => {
  const { username } = req.cookies;
  const { date, content } = req.body;
  // console.log(username, date, content);
  models.Entry.findOneAndUpdate(
    { username, date },
    { content },
    (err, updatedSingle) => {
      if (err) return next({ log: err });
      res.locals.updateSingle = updatedSingle;
      return next();
    }
  );
};

entryController.deleteSingle = (req, res, next) => {
  const { username } = req.cookies;
  const { date } = req.body;
  models.Entry.findOneAndDelete({ username, date }, (err, deletedSingle) => {
    if (err) return next({ log: err });
    res.locals.deleteSingle = deletedSingle;
    return next();
  });
};

module.exports = entryController;
