const mongoose = require('mongoose')
const Schema = mongoose.Schema


const serviceSchema = new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName:{
        type:String,
        default:'Unknown Business Name'
    },
    albums:{
       type:Object,
       value:{
        type:[String]
       }
    },
    serviceType:{
        type:String,
        enum:['photographer','videographer'],
        required:true  
    },
    serviceActiveStatus:{
        type:Boolean,
        default:false
    },

    serviceDescription:String,

    pricingPackages:String,

    yearsOfExperience:Number,

    certificationsAndAwards:String,

    equipmentDetails:String,

    bio:String,

    spokenLanguages:String,

    travelTermsAndConditions:String,

    estimatedPrice:Number,

    priceTimeUnit:{
        type:String,
        enum:['perDay','perHour']
    },

    estimatedPriceDescription:String

});

module.exports = new mongoose.model('Service',serviceSchema)