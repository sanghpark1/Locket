const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const userRouter = require('./routes/users');
const entryRouter = require('./routes/entries')
const port = 3000;

// parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// parse cookies
app.use(cookieParser());

// route handlers:
app.use("/user", userRouter);
app.use("/entry", entryRouter);

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', function (req, res) {
res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});


// catch-all error handler
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