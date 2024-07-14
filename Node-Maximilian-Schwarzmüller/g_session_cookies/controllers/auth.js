
const User = require('../models/user')

exports.getLogin = (req,res,next) => {
    console.log(req.session.isLoggedIn)

    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        isAuthenticated: true
    })
}

exports.postLogin = (req,res,next) => {
    User.findById('66904b2c68276a99b5489e32')
    .then(user => {
        req.session.user = user; // coming from express-session
        req.session.save((err)=>{
            res.redirect('/')
        })
    })
}

exports.postLogout = (req,res,next) => {
   req.session.destroy(()=>{
        res.redirect('/')
   })
}