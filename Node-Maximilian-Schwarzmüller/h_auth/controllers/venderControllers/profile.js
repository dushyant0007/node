const Vender = require('../../models/vender')


exports.getProfile = async (req,res,next) => {
    if(!req.session.user || req.session.user.userType != 'vender')
        return res.redirect('/vender/login');
    
    const venderDetails = await Vender.findOne({userId:req.session.user._id},'profilePictureUrl name phoneNumber address -_id');

    const venderProfile = {
        profilePictureUrl:venderDetails.profilePictureUrl,
        name:venderDetails.name,
        email:req.user.email,
        phoneNumber:venderDetails.phoneNumber,
        address:venderDetails.address,
    };

    return res.render('vender/profile.ejs',{venderProfile});
}

exports.postEditName = async (req,res,next) => {

    if(!req.session.user || req.session.user.userType != 'vender')
        return res.redirect('/vender/login');

    const venderDetails = await Vender.findOne({userId:req.session.user._id},'name');
    venderDetails.name = req.body.name;
    await venderDetails.save();

    res.redirect('/vender/profile');
}

exports.postEditEmail = async (req,res,next) => {

    if(!req.session.user || req.session.user.userType != 'vender')
        return res.redirect('/vender/login');

    req.user.email = req.body.email;
    await req.user.save();

    res.redirect('/vender/profile');
}

exports.postEditPhoneNumber = async (req,res,next) => {

    if(!req.session.user || req.session.user.userType != 'vender')
        return res.redirect('/vender/login');

    const venderDetails = await Vender.findOne({userId:req.session.user._id},'phoneNumber');
    venderDetails.phoneNumber = req.body.phoneNumber;
    await venderDetails.save();

    res.redirect('/vender/profile');
}

exports.postEditAddress = async (req,res,next) => {

    if(!req.session.user || req.session.user.userType != 'vender')
        return res.redirect('/vender/login');

    const venderDetails = await Vender.findOne({userId:req.session.user._id},'address');
    venderDetails.address = req.body.address;
    await venderDetails.save();

    res.redirect('/vender/profile');
}