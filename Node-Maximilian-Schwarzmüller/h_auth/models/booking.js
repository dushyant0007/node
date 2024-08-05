const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookingSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    dates: {
        type: [Schema.Types.Date],
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    stripeSessionId: {
        type: Schema.Types.String,
        required: true
    },
    paymentStatus: {
        type: Schema.Types.String,
        required: true,
        enum: ['paid', 'unpaid', 'no_payment_required']
    },
    status: {
        type: Schema.Types.String,
        require: true,
        enum: ['complete', 'expired', 'open']
    },

    review: {
        type: {
            rating: Number,
            comment: String,
            date: Date
        },
        default: {
            rating: 10,
            comment: '',
            date: null
        }
    }
});

module.exports = mongoose.model('Booking', bookingSchema)