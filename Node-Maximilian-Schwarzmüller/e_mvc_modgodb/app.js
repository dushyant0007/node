const path = require('path')

const express = require('express');
const body_parser = require('body-parser')

const mongoConnect = require('./util/dbConnection.js')

const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views') // where is our views, they are in views folder

app.use(body_parser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const errorController = require('./controllers/error.js')
const adminRoutes = require('./routes/admin.js')
const shopRoutes = require('./routes/shop.js');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/', errorController.get404)

mongoConnect(client => {
    console.log('Database Connection Successful')
    app.listen(3000)
})

