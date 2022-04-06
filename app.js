const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config()

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const mongoose = require('mongoose');




app.use((req, res, next) => {
    res.setHeader('Access-Control-allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'views')));



mongoose.connect(MONGO_URI).then(() => {
    console.log('connected');

    app.listen(PORT);

}).catch(error => {
    console.log(error);
})
