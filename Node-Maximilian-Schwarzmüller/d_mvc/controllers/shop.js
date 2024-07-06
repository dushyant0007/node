const { render } = require('ejs');
const Product = require('../models/product')
const Cart = require('../models/cart')



exports.getIndex = (req,res,next) => {
    const products = Product.fetchAll();
    res.render('shop/index.ejs',{
        products: products,
        pageTitle:'Shop',
        path: '/',
        hasProducts:products.length > 0,

    });
}

exports.getProducts = (req,res,next)=>{
    const products = Product.fetchAll();
    res.render('shop/product-list',{
        products: products,
        pageTitle:'All Products',
        path: '/products',
        hasProducts:products.length > 0,

    });
}

exports.getProduct = (req,res,next) => {
    const product_id = req.params.productId;
    const product = Product.findProductById(product_id)
    
    res.render('shop/product-details.ejs',{
        product:product,
        pageTitle:'Your Orders',
        path:`/product/${product_id}`,
    })
}


exports.getCart = (req,res,next) => {
    res.render('shop/cart.ejs',{
        pageTitle:'Your Cart',
        path:'/cart',
    })
}



exports.postCart = (req,res,next) => {
    const productId = req.body.productId
    const productPrice = Product.findProductById(productId).price
    Cart.addProduct(productId,productPrice)
    res.redirect('/cart')
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout.ejs',{
        pageTitle:'Checkout',
        path:'/checkout',
    })
}
exports.getOrders = (req,res,next) => {
    res.render('shop/orders.ejs',{
        pageTitle:'Your Orders',
        path:'/cart',
    })
}


