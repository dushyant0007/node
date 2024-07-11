const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    order: {
        type: [{
            product: { type: mongoose.Schema.Types.Object, required: true },
            quantity: { type: Number, required: true }
        }],
        required: true
    }
});


module.exports = mongoose.model("Order",orderSchema)