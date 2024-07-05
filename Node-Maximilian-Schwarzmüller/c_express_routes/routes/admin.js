const router = require("express").Router()
const path = require('path')

const products = []

router.use('/add-product',(req,res,next)=>{
    if (req.method == "GET")

        // res.sendFile(path.join(__dirname,'../views/add-product.html'))
        res.render('add-product.ejs',
            {
                pageTitle:"add-product",
                path: '/admin/add-product',
                activeShop: true,
                productCSS: true
            })

    else
        next();
}) 

router.post('/add-product',(req,res,next)=>{
    products.push({ 
        title:req.body.title,
        
    });

    res.redirect('/');
})

module.exports = {router,products}
