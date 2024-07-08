
const Product = require('../models/product')
const Cart = require('../models/cart');
const Sequelize = require('sequelize')
const CartItem = require('../models/cart_item');
const db = require('../util/dbConnection')



exports.getIndex = (req, res, next) => {
    Product.findAll({ raw: true })
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
    Product.findAll({ raw: true })
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
        Product.findByPk(product_id)
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

    Cart.findOne({ where: { userId: req.user.id }, raw: true })
        .then((result) => {
            if (!result)
                return Cart.create({ userId: req.user.id }).id
            return result.id
        })
        .then(cartId => {
            return db.query('SELECT *,cart_items.id as cart_item_id FROM cart_items JOIN products on cart_items.productId = products.id where cartId=?',
                {
                    replacements: [cartId],
                    type: Sequelize.QueryTypes.SELECT
                })
        })
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

    Cart.findOne({ where: { userId: req.user.id }, raw: true })
        .then((result) => {
            if (!result)
                return Cart.create({ userId: req.user.id }).id
            return result.id
        })
        .then((cartId) => {
            return Promise.all(
                [CartItem.findOne({ where: { cartId: cartId, productId: productId }}),
                    cartId]);
        })
        .then(([cartItem, cartId]) => {
            if (cartItem) {
                cartItem.quantity += 1
                return cartItem.save();
            }
            else {
                return cartItem.create({ quantity: 1, productId: productId, cartId: cartId })
            }
        })
        .then(() => {
            res.redirect('/products')
        })
        .catch((error) => {
            res.render('404.ejs', { pageTitle: 'wrong request', path: '', error: error })
        });
}


exports.postRecedeCartQty = (req, res, next) => {

    const cart_product_id = req.body.cart_item_id;

    CartItem.findByPk(cart_product_id)
        .then((result) => {
            if (result)
                if (result.quantity > 1) {
                    result.quantity -= 1
                    result.save();
                } else {
                    result.destroy()
                }
            else {
                throw Error('There is not such product in cart')
            }
        })
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
    res.render('shop/orders.ejs', {
        pageTitle: 'Your Orders',
        path: '/cart',
    })
}


