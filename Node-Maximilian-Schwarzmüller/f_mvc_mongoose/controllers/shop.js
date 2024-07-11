// const db = require('../util/dbConnection').getDb()
const Product = require('../models/product');
const User = require('../models/user')
const Order = require('../models/order');
const product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.find()
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
    Product.find()
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
    req.user.getCart()
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
    req.user.addToCart(productId)
        .then(() => {
            res.redirect('/products')
        })
        .catch((error) => {
            res.render('404.ejs', { pageTitle: 'wrong request', path: '', error: error })
        });
}


exports.postRecedeCartQty = (req, res, next) => {
    const cart_product_id = req.body.cart_item_id;
    req.user.decreaseCartItemQuality(cart_product_id)
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
    const user_id = req.user._id
    Order.find({userId:user_id},'order -_id')
        .then((orders) => {
            res.render('shop/orders.ejs', {
                pageTitle: 'Your Orders',
                path: '/cart',
                orders: orders
            })
        })
}

exports.postOrder = (req, res, next) => {
    req.user.getCart()
        .then((products) => {
            const order = new Order({
                userId: req.user._id,
                order: products.map(i => {
                    return { product: { ...i.productId._doc }, quantity: i.quantity }
                })
            });
            order.save();

        })
        .then(() => {
            req.user.clearCart();
        })
        .then(() => {
            res.send('ok bro')
        })
        .catch(error => {
            console.log(error)
        })
}

