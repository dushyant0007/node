
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: {
            values: ['customer', 'vendor'],
            message: '{VALUE} is not in enum'
        }
    }
})

module.exports = new mongoose.model('User', userSchema)