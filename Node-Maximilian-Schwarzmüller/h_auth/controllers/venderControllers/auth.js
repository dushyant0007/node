const User = require('../../models/user')
const Vender = require('../../models/vender')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {  
    if(req.session.user)  
        return res.redirect('/vender/dashboard')

    return res.render('vender/login.ejs')
}

exports.postLogin = async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const isUserExists = await User.findOne({email:email})

    if(!isUserExists)
        return res.send('No user exists with this email')

    const isPasswordCorrect = await bcrypt.compare(password,isUserExists.password)

    if(!isPasswordCorrect)
        return res.send('wrong password')


    req.session.user = isUserExists
    return res.redirect('/vender/profile')

}

exports.getSignUp = (req, res, next) => {
    if(req.session.user)  
        return res.redirect('/vender/dashboard')

    return res.render('vender/signup.ejs')
}


exports.postSignUp = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const isUserExists = await User.findOne({email:email})

    if(isUserExists)
        return res.send('The User already exists with this email')

    const hashPassword = await bcrypt.hash(password,12)

    const newUser = await User.create({email:email,password:hashPassword,userType:'vender'})
    const newVender = await Vender.create({userId:newUser._id})

    req.session.user = newUser

    return res.redirect('/vender/profile')
}


