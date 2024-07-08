const Sequelize = require('sequelize')
const sequelize = require('../util/dbConnection')


const CartItems = sequelize.define('cart_item',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    quantity:Sequelize.INTEGER
});

module.exports = CartItems
