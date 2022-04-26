const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config()
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const categoryRoutes = require('./routes/categories');
const itemRoutes = require('./routes/item');
const imageRoutes = require('./routes/image');
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose');
const headers = require('./middleware/headers');

const options = {
    root: path.join(__dirname, 'views')
    
};

const store = new MongoDBStore({
    uri: MONGO_URI,
    databaseName: 'webShop',
    collection: 'sessions'
});

store.on('error', error => {
    console.log(error);
});


app.use(headers);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, store: store }));

app.enable('trust proxy');

app.use('*', function(req, res, next) {
    if(req.secure) {
      next();
    } else {
        return res.redirect( 301, "https://" + req.headers.host + req.url);
    }
})


app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/item', itemRoutes);
app.use('/image', imageRoutes);


app.use('*', (req, res) => {
    res.sendFile('/index.html', options);
});


mongoose.connect(MONGO_URI).then(() => {
    console.log('connected');

    app.listen(PORT);

}).catch(error => {
    console.log(error);
})
