const fs = require('fs')
const path = require('path')
const Product = require('./product')

const cartPth = path.join(__dirname, 'cart.json')

module.exports = class Cart {


    static addProduct(id, productPrice) {

        fs.readFile(cartPth, (err, fileContentBuff) => {

            let cart = { products: [], totalPrice: 0 }

            if (!err) {
                cart = JSON.parse(fileContentBuff)
            }
            const existingProductIdx = cart.products.findIndex(product => product.id === id)

            if (existingProductIdx != -1) {
                cart.products[existingProductIdx].qty += 1
            }
            else {

                let updatedProduct = { id: id, qty: 1 }
                cart.products.push(updatedProduct)
            }
            cart.totalPrice = (parseInt(cart.totalPrice) + parseInt(productPrice)).toString()
            fs.writeFile(cartPth, JSON.stringify(cart), (err) => { if (err) console.log(err) })

        });

    }

}