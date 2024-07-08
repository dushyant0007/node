const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const mongoConnect = (callback)=>{
    MongoClient.connect('mongodb+srv://admin:JhaGZkBkBTyMda69@cluster0.gfskg3g.mongodb.net/')
    .then((client)=>{
        callback(client)
    })
    .catch((error)=>{
        console.error('data-base connector failed')
    })
}

module.exports = mongoConnect