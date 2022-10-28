const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const userRouter = require('./routes/users');
const entryRouter = require('./routes/entries')
// const User = require('./models/allModel');

/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// above is necessary or req.body will come back undefined
// although, not really sure about the second line there, but def the first one

// route handlers below:

app.use(cookieParser());

app.use("/user", userRouter);

app.use("/entry", entryRouter);


// catch all
app.use((req, res) => res.status(404).send('This page does not exist.'));

// global error handler
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});



app.listen(port, () => { console.log(`Server listening on port ${port}`) });