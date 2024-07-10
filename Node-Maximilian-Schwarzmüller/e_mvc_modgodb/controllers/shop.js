// const db = require('../util/dbConnection').getDb()
const Product = require('../models/product');
const User = require('../models/user')

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((result) => {
            res.render('shop/index.ejs', {
                products: result,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: result.length > 0,
            });
        })
        .catch();
}

exports.getProducts = (req, res, next) => {
        Product.fetchAll()
        .then((result) => {
            res.render('shop/product-list.ejs', {
                products: result,
                pageTitle: 'All Products',
                path: '/products',
                hasProducts: result.length > 0,
            });
        })
        .catch();
}

exports.getProduct = (req, res, next) => {
    const product_id = req.params.productId;

    if (product_id)
        Product.findById(product_id)
            .then((result) =>
                res.render('shop/product-details.ejs', {
                    product: result,
                    pageTitle: result.title,
                    path: `/product/${product_id}`,
                })
            )
            .catch((err) => console.log(err))
}


exports.getCart = (req, res, next) => {
    User.getCart(req.user._id)
        .then(products => {
            
            res.render('shop/cart.ejs', {
                pageTitle: 'Your Cart',
                path: '/cart',
                cartProducts: products
            })
        })
        .catch((error) => {
            res.render('404.ejs', { pageTitle: 'wrong request', path: '', error: error })
        })
}



exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.user._id
        User.addToCart(productId,userId)
        .then(() => {
            res.redirect('/products')
        })
        .catch((error) => {
            res.render('404.ejs', { pageTitle: 'wrong request', path: '', error: error })
        });
}


exports.postRecedeCartQty = (req, res, next) => {

    const cart_product_id = req.body.cart_item_id;
    const user_id = req.user._id
    User.decreaseCartItemQuality(user_id,cart_product_id)
        .then(() => {
            res.redirect('/cart')
        })
        .catch((error) => {
            res.render('404.ejs', { pageTitle: 'wrong request', path: '', error: error })
        });

}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout.ejs', {
        pageTitle: 'Checkout',
        path: '/checkout',
    })
}

exports.getOrders = (req, res, next) => {
    const user_id =req.user._id
    User.getOrders(user_id)
    .then((orders)=>{
        console.log(orders)
        res.render('shop/orders.ejs', {
            pageTitle: 'Your Orders',
            path: '/cart',
            orders:orders
        })
    })  
}

exports.postOrder = (req,res,next) => {
    const userId = req.user._id
    // put cart into orders
    User.addOrder(userId)
    res.send('ok bro')
}

