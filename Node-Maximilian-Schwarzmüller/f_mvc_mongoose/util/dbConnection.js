const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://admin:JhaGZkBkBTyMda69@cluster0.gfskg3g.mongodb.net/shop')
    .then((client)=>{
        _db = client.db('shop')
        callback()
        return client
    })
    .catch((error)=>{
        console.error('data-base connector failed')
    })
}

function getDb(){
    if(_db)
        return _db;
    else
        throw Error('db connection failed')
}


module.exports = {mongoConnect,getDb}

