const path = require('path')

const express = require('express');
const body_parser = require('body-parser')

const errorController = require('./controllers/error.js')

const sequelize = require('./util/dbConnection.js')
const Product = require('./models/product.js')
const User = require('./models/user.js')
const Cart = require('./models/cart')
const CartItem = require('./models/cart_item.js')

const app = express()



app.set('view engine', 'ejs')
app.set('views', 'views') // where is our views, they are in views folder

const adminRoutes = require('./routes/admin.js')
const shopRoutes = require('./routes/shop.js');
const { FORCE } = require('sequelize/lib/index-hints');


app.use(body_parser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))


app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next();
        })
        .catch(error => {
            console.log(error)
            res.redirect('/')
        })

})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404)




Product.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

// sync db with sequelize model
// sequelize.sync({force:true})
sequelize.sync()
    .then((result) => {
        return User.findByPk(1)
    })
    .then((user) => {
        if (!user) {
            return User.create({ name: 'Max', email: 'em.@mail.com' });
        }
        return user
    })
    .then(() => {
        app.listen(3000)
    })
    .catch(result => { console.log(result) });


