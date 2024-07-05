const route = require('express').Router()
const path = require('path')
const adminData = require('./admin.js')

route.get('/',(req,res,next)=>{
    
    // res.sendFile(path.join(__dirname,'../views/shop.html'))
    res.render('shop',{
        products: adminData.products,
        pageTitle:'Shop',
        path: '/',
        hasProducts: adminData.products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = route;