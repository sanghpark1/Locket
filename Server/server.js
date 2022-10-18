const express = require('express');
const app = express();
const port = 3000;
const userRouter = require('./routes/users');

const User = require('./models/userModel');


app.get("/api", userRouter);

app.listen(port, () => { console.log(`Server started on port ${port}`) });