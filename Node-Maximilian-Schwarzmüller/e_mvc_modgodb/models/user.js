const mongodb = require('mongodb')
const db = require('../util/dbConnection').getDb
const Product = require('../models/product');
const { all } = require('../routes/admin');
const { promiseImpl } = require('ejs');


class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.cart = { items: [] } // {items: [{projectId: '12345',quantity:12}]}
    }


    static save(user) {
        return db().collection('users').insertOne(user)
    }

    static findById(userId) {
        return db().collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
    }

    static addToCart(_productId, userId) {
        const productId = new mongodb.ObjectId(_productId)
        return User.findById(userId)
            .then((curr_user) => {
                if (!curr_user) {
                    return Promise.reject('addToCart operation failed, user does not exist')
                }
                else {
                    const cpi = curr_user.cart.items.findIndex(cp => cp.productId.toString() == productId.toString() )

                    if (cpi != -1) {
                        curr_user.cart.items[cpi].quantity += 1
                    }
                    else {
                        curr_user.cart.items.push({ productId: productId, quantity: 1 })
                    }
                    return db().collection('users').updateOne({ _id: userId }, { $set: { cart: curr_user.cart } })
                }
            })
    }


    static getCart(userId) {
        return db().collection('users').aggregate([
            { $match: { _id: new mongodb.ObjectId(userId) } },
            { $project: { cart: 1 } },
            { $unwind: '$cart.items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'cart.items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: '$product._id',
                    title: '$product.title',
                    price: '$product.price',
                    description: '$product.description',
                    imageUrl: '$product.imageUrl',
                    quantity: '$cart.items.quantity'
                }
            }
        ]).toArray();
    }

    static decreaseCartItemQuality(user_id, cart_product_id) {
        const userId = new mongodb.ObjectId(user_id);
        const cartProductId = new mongodb.ObjectId(cart_product_id);

        return db().collection('users').findOne({ _id: userId })
            .then(user => {
                let proIdx = user.cart.items.findIndex(p => p.productId.equals(cartProductId));

                if (proIdx === -1) {
                    throw new Error('Product not found in cart');
                }

                if (user.cart.items[proIdx].quantity > 1) {
                    user.cart.items[proIdx].quantity -= 1;
                } else {
                    user.cart.items.splice(proIdx, 1);
                }

                return db().collection('users').updateOne(
                    { _id: userId },
                    { $set: { 'cart.items': user.cart.items } }
                );
            });
    }

    static async addOrder(user_id){
        const curr_user = await db().collection('users').findOne({_id:user_id})
        const insertToOrders = await db().collection('orders').insertOne({items:curr_user.cart.items,userId:user_id})
        return await db().collection('users').updateOne({_id:curr_user._id},{$set:{cart:{items:[]} }})
    }

    static async getOrders(user_id) {
        const orders = await db().collection('orders').find({ userId: new mongodb.ObjectId(user_id) }).toArray();
        const all_orders = []
        for(const order of orders){
            const singleOrder = []
            for (const item of order.items){
                const product = await db().collection('products').findOne({_id: new mongodb.ObjectId(item.productId)})
                product.quantity = item.quantity;
                singleOrder.push(product)
            }
            all_orders.push(singleOrder)
        }
        return all_orders
    }
}




module.exports = User 