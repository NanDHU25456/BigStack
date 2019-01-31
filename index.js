const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const question = require('./routes/api/question');
const passport = require('passport');

//mongoDB configuration
const db = require('./setup/myurl').mongoURL;

//Middleware for body-parser
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());

//Middleware for passport
app.use(passport.initialize());

//Middleware for JWT Strategy
require('./Strategies/jsonwtstrategy')(passport);

//Attempt to connect to DB
mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log(err))

//route --> test
app.get('/', (req, res) => {
    res.send('hey there bigstack');
});

// Actual Routes
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/question', question);

app.listen(port, () => {
    console.log(`App is running at ${port}`);
});