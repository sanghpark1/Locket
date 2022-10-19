const express = require('express');
const app = express();
const port = 3000;
const userRouter = require('./routes/users');
const User = require('./models/userModel');

/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// above is necessary or req.body will come back undefined

// route handlers below:

app.use("/userlist", userRouter);



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