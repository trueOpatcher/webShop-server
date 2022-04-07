const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config()

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const mongoose = require('mongoose');

const headers = require('./middleware/headers');

const categoryRoutes = require('./routes/categories');


app.use(headers);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'views')));



app.use('/categories', categoryRoutes);


mongoose.connect(MONGO_URI).then(() => {
    console.log('connected');

    app.listen(PORT);

}).catch(error => {
    console.log(error);
})
