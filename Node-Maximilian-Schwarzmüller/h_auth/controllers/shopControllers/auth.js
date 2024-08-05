const User = require('../../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    return res.render('shop/login.ejs',{isUserAuthenticated:false})
}

exports.postLogin = async (req, res, next) => {
    
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email })

    if (!user)
        return res.send('No user exists with this email')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect)
        return res.send('wrong password')


    req.session.user = {_id:user._id,userType:user.userType}
    return res.redirect('/shop/home')
}

exports.getSignUp = (req, res, next) => {
    return res.render('shop/signup.ejs',{isUserAuthenticated:false})
}


exports.postSignUp = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const isUserExists = await User.findOne({ email: email })

    if (isUserExists)
        return res.send('The User already exists with this email')

    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({ email: email, password: hashPassword, userType: 'customer' })

    req.session.user = newUser;

    return res.redirect('/shop/home')
}

exports.getLogout = async(req,res,next) => {
    await req.session.destroy((err)=>{console.log(err,'logout controller error')});
    req.user = null;

    return res.redirect('/shop/auth/login');
}

