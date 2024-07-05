const http = require('http');
const express = require('express');
const path = require('path')
const body_parser = require('body-parser')



const adminData = require('./routes/admin.js')
const shopRoutes = require('./routes/shop.js')

const app = express()
console.log(process.cwd())

app.set('view engine','ejs')
app.set('views','views') // where is our views, they are in views folder

app.use(body_parser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminData.router);
app.use(shopRoutes);



app.use('/',(req,res,next)=>{
    // res.status(404).sendFile(path.join(__dirname,'/views/404.html'))
    res.status(404).render('404.ejs',{pageTitle:'page not found'})
})



app.listen(3000);

                                