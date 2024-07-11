const path = require('path')

const express = require('express');
const body_parser = require('body-parser')
const User = require('./models/user.js')
const mongoose = require('mongoose')

const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views') // where is our views, they are in views folder

app.use(body_parser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use((req,res,next)=>{
    User.findById('668fe6bf80f130220089771a') 
        .then((user)=>{
            req.user = user
            next()
        })
        .catch(error => {console.log(error),process.exit()})
})

const errorController = require('./controllers/error.js')
const adminRoutes = require('./routes/admin.js')
const shopRoutes = require('./routes/shop.js');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/', errorController.get404)

mongoose.connect('mongodb+srv://admin:JhaGZkBkBTyMda69@cluster0.gfskg3g.mongodb.net/shop')
.then(()=>{
    // const user = new User({name:'Max',email:'max@email.com'});
    // user.save()
    app.listen(3000)
})
.catch(error =>{
    console.log(error)
})