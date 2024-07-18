const MONGO_CONNECTION_STRING = 'mongodb+srv://admin:s25IWKm3i7Hafoy6@cluster0.gfskg3g.mongodb.net/wedSoul'

const path = require('path')
const User = require('./models/user')

const fs =  require('fs')

const mongoose = require('mongoose')
const express = require('express')
const body_parser = require('body-parser')
const session = require('express-session')
const mongo_session_store = require('connect-mongo')

const app = express()


app.use(body_parser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'cookie-encrypt-key',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 60 },
    store: mongo_session_store.create({mongoUrl:MONGO_CONNECTION_STRING})
    })
);

app.use(async (req, res, next) => {
    if (req.session.user) {
        req.user = await User.findById(req.session.user._id);
    }
    next() 
})

// const shopRoutes = require('./routes/shop')
const venderRoutes = require('./routes/vender')

app.use('/vender', venderRoutes)
// app.use('/shop',shopRoutes)


app.use('/', (req, res) => {
    // res.send('Route does not exists')
    res.render('vender/test.ejs')
})

mongoose.connect(MONGO_CONNECTION_STRING)
    .then(() => {
        console.log('Data base connection successful')
        app.listen(3000)
    })