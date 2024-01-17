const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })};
    
////////////////// ////////////////// ////////////////// ////////////////// 

exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

////////////////// ////////////////// ////////////////// ////////////////// 

exports.login = catchAsync( async function (req, res, next) {
    const { email, password } = req.body;

    // 1. check if email password exists
    if(!email || !password){
        next(new AppError("Please provide email and password",400));
        return;
    }

    // 2. check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || ! await user.correctPassword(password,user.password) ){
        next(new AppError("Incorrect email or password",401));
        return ;
    }

    // 3. send token to client
    const token = signToken(user._id);

    return res.status(200).json({
        status:'success',
        token
    })

});

////////////////// ////////////////// ////////////////// ////////////////// 

exports.protect = catchAsync( async function(req,res,next){
 
    // 1) Getting token and check of its's there
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if(!token)
        return next(new AppError('Your are not logged in! Please login in to get access',401));
    
    // 2) token verification

    //decoded_payload
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    // 3) Check if user sill exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser)
        return next(new AppError('The user belonging to the token does no longer exist.',401));

    // 4) Check if user changed password after the token was issued
    if(freshUser.changesPasswordAfter(decoded.iat)){
        return next(new AppError('User has changed their password. Log in again!',401)); 
    };


    //for next middlewares
    req.user  = freshUser;

    //Grant access to protected routs
    next();
})