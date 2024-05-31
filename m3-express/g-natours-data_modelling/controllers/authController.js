const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })};
    
const createSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id);
    const cookie_options = {
        expires: new Date(Date.now() + process.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // converting to millisecond
        secure:false, // only send cookie of connection is using https 
        httpOnly:true // cookie can't be accessed or modified in any way by the browser
    }
    if(process.env.NODE_ENV == 'production') cookie_options.secure = true;
    res.cookie('jwt token',token,cookie_options);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

////////////////// ////////////////// ////////////////// ////////////////// 

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });

    createSendToken(newUser,201,res);

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
    createSendToken(user,200,res);

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
    
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User has changed their password. Log in again!',401)); 
    };


    //for next middlewares
    req.user  = freshUser;

    //Grant access to protected routs
    next();
});

////////////////// ////////////////// ////////////////// ////////////////// 


exports.restrictTo = (...roles)=>{
    //roles ['admin','lead-guid']
    return (req,res,next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError("You do not have permission to perform action",403));
        
        next();
    }
};

////////////////// ////////////////// ////////////////// ////////////////// 


exports.forgetPassword = catchAsync(async(req,res,next)=>{
    // 1) Get user based on posted email
    const user = await User.findOne({email:req.body.email});
    if(!user)
        return next(new AppError('There is no user with email address.',404));
    
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

    // 3) Send it to user's email
    const resetURL = req.protocol+"//"+req.get('host')+"/api/v1/users/resetPassword/"+resetToken;
    const message = `Forget your password? Submit a PATCH request with your new password and 
    confirm password to : ${resetURL}. \n If you did't forget your password, please ignore this email`;

    console.log(resetURL,'\n',message)

    try{
        await sendEmail ({
            email:user.email,
            subject:'Your password reset token (valid for 10 min)',
            message
        });
        
        res.status(200).json({
            status:'success',
            message: 'Token sent to email'
        });
        
    }
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave:false});
    }

    return next(new AppError('There was an error sending the email. Try again later!'),500)
});

exports.resetPassword = catchAsync(async(req,res,next)=>{
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne(
        {
            passwordResetToken:hashedToken,
            passwordResetExpires:{$gt:Date.now()}
        });

    // 2) If token has not expired, and there is a uer, set the new password
    if(!user){
        return next(new AppError("Invalid or Expired Token",400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    console.log(user.isNew)
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in (send JWT)
    createSendToken(user,200,res);
});

////////////////// ////////////////// ////////////////// ////////////////// /////////////////

exports.updatePassword = catchAsync( async (req,res,next)=>{

    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if posted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password)))
        return next(new AppError('Your current password is wrong.',401));
    
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.password;
    await user.save();


    // 4) Log user in, send JWT
    createSendToken(user,200,res);
});