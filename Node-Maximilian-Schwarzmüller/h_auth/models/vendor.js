
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vendorSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    profilePictureUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FydG9vbnxlbnwwfHwwfHx8MA%3D%3D'
    },

    name: {
        type: String,
        default: 'Update your name'
    },

    phoneNumber: {
        type: Number,
        default: "1234567890"
    },

    address: {
        type: String,
        default: "Update You Address"
    },

    location: {
        latitude: Number,
        longitude: Number
    },

    reviews: [
        {
            userId: Schema.Types.ObjectId,
            rating: Number,
            comment: String,
            date: Date
        }
    ],

    ratingsInfo: {
        rating: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    }

})

module.exports = new mongoose.model('vendor', vendorSchema)