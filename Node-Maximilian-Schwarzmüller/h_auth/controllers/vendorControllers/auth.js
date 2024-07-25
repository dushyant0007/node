const User = require('../../models/user')
const vendor = require('../../models/vendor')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    return res.render('vendor/login.ejs')
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
    return res.redirect('/vendor/profile')

}

exports.getSignUp = (req, res, next) => {
    return res.render('vendor/signup.ejs')
}


exports.postSignUp = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const isUserExists = await User.findOne({ email: email })

    if (isUserExists)
        return res.send('The User already exists with this email')

    const hashPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({ email: email, password: hashPassword, userType: 'vendor' })
    await vendor.create({ userId: newUser._id })

    req.session.user = newUser

    return res.redirect('/vendor/profile')
}


