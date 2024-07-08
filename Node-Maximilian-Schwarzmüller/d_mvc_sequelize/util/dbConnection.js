
const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_complete','root','rootroot',{dialect:'mysql',host:'localhost',port:3306})

module.exports = sequelize;















// ----------------------------------------------------

// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host:'localhost',
//     port:'3306',
//     user:'root',
//     database:'node_complete',
//     password:'rootroot'
// });

// module.exports = pool.promise()


/*
return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)',
    [this.title,this.price,this.imageUrl,this.description])
*/ 

/*
    return db.execute('SELECT * FROM node_complete.Products where id = ?',[productId])
*/ 

/*
    model.js
        return db.execute('SELECT * FROM node_complete.Products)

    controller.js
        Product.fetchAll()
        .then((result) => {
            res.render('shop/product-list.ejs',{
                products: result[0],
                pageTitle:'All Products',
                path: '/products',
                hasProducts:result[0].length > 0,
            });
        })
        .catch((err)=>{console.log(err)});
    */
