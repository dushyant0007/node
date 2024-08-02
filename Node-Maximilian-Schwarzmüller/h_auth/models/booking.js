const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookingSchema = new Schema({

    customerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId:{
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    dates:{
        type:[Schema.Types.Date],
        required:true
    },
    price:{
        type:Schema.Types.Decimal128,
        required:true
    }

});

module.exports = mongoose.model('Booking',bookingSchema)