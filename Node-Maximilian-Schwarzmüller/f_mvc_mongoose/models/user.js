const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    cart: {
        type: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    }
});

userSchema.methods.addToCart = function (productId) {
    // this -> refers to schemaObject/rowOfTable

    const cartProductsIndex = this.cart.findIndex(cp => {
        return cp.productId.toString() === productId.toString()
    })

    if (cartProductsIndex == -1)
        this.cart.push({ productId, quantity: 1 })
    else
        this.cart[cartProductsIndex].quantity += 1

    return this.save()
}

userSchema.methods.getCart = function () {
    return this.populate('cart.productId')
        .then((populated_user_obj) => {
            return populated_user_obj.cart
        })
        .catch(error => {
            console.log(error)
            return error
        })
}

userSchema.methods.decreaseCartItemQuality = function (cart_product_id) {
    const cartProductsIndex = this.cart.findIndex(cp => {
        return cp.productId.toString() === cp.productId.toString()
    });

    if (cartProductsIndex == -1)
        throw Error('The product doest exist who quality you wanna decares')
    else if (this.cart[cartProductsIndex].quantity > 1)
        this.cart[cartProductsIndex].quantity -= 1
    else
        this.cart.splice(cartProductsIndex,1)

    return this.save()
}

userSchema.methods.clearCart = function (){
    this.cart = [];
    return this.save(); 
}
module.exports = mongoose.model('User', userSchema)