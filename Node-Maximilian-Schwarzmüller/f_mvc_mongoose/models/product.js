const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

module.exports = mongoose.model('Product',productSchema)




// const mongodb = require('mongodb')
// const db = require('../util/dbConnection').getDb;

// class Product {
//     constructor(title, imageUrl, price, description,userId) {
//         this.title = title
//         this.imageUrl = imageUrl
//         this.price = price
//         this.description = description
//         this.userId = userId
//     }

//     static save(product) {
//         return db().collection('products')
//             .insertOne(product)
//             .then(insertedItem => {
//                 console.log(insertedItem)
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static fetchAll() {
//         return db().collection('products')
//             .find().toArray()
//             .then(products => {
//                 // console.log(products)
//                 return products
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static findById(productId) {
//         console.log(productId)
//         return db().collection('products').find({ _id: new mongodb.ObjectId(productId) }).next()
//             .then(product => {
//                 // console.log(product)
//                 return product
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static updateById(productId,updateProduct) {
//         return db().collection('products').updateOne({ _id: new mongodb.ObjectId(productId) },
//         {$set:updateProduct})
//     }

//     static deleteById(productId){
//         return db().collection('products').deleteOne({_id:new mongodb.ObjectId(productId)})
//     }
// }


// module.exports = Product