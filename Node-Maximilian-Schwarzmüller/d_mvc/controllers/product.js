const Product = require('../models/product')

module.exports.get_addProduct = (req, res, next) => {
        res.render('add-product.ejs',
            {
                pageTitle: "add-product",
                path: '/admin/add-product',
                activeShop: true,
                productCSS: true
            })
}


exports.post_addProduct = (req, res, next)=>{
    const product = new Product(req.body.title)
    product.save()

    res.redirect('/');
}


exports.get_getProducts = (req,res,next)=>{
    const products = Product.fetchAll();
    res.render('shop',{
        products: products,
        pageTitle:'Shop',
        path: '/',
        hasProducts:products.length > 0,
        activeShop: true,
        productCSS: true
    });
}