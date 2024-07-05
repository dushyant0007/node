const http = require('http');
const express = require('express');
const path = require('path')
const body_parser = require('body-parser')

const errorController = require('./controllers/error.js')


const adminRoutes = require('./routes/admin.js')
const shopRoutes = require('./routes/shop.js')

const app = express()
console.log(process.cwd())

app.set('view engine','ejs')
app.set('views','views') // where is our views, they are in views folder

app.use(body_parser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRoutes);
app.use(shopRoutes);



app.use('/',errorController.get404)



app.listen(3000);

                                