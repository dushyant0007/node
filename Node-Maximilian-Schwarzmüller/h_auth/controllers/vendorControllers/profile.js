const vendor = require('../../models/vendor')


exports.getProfile = async (req, res, next) => {

    const vendorDetails = await vendor.findOne({ userId: req.session.user._id }, 'profilePictureUrl name phoneNumber address -_id');

    const vendorProfile = {
        profilePictureUrl: vendorDetails.profilePictureUrl,
        name: vendorDetails.name,
        email: req.user.email,
        phoneNumber: vendorDetails.phoneNumber,
        address: vendorDetails.address,
    };

    return res.render('vendor/profile.ejs', { vendorProfile });
}

exports.postEditName = async (req, res, next) => {

    const vendorDetails = await vendor.findOne({ userId: req.session.user._id }, 'name');
    vendorDetails.name = req.body.name;
    await vendorDetails.save();

    res.redirect('/vendor/profile');
}

exports.postEditEmail = async (req, res, next) => {

    req.user.email = req.body.email;
    await req.user.save();

    res.redirect('/vendor/profile');
}

exports.postEditPhoneNumber = async (req, res, next) => {

    const vendorDetails = await vendor.findOne({ userId: req.session.user._id }, 'phoneNumber');
    vendorDetails.phoneNumber = req.body.phoneNumber;
    await vendorDetails.save();

    res.redirect('/vendor/profile');
}

exports.postEditAddress = async (req, res, next) => {

    const vendorDetails = await vendor.findOne({ userId: req.session.user._id }, 'address');
    vendorDetails.address = req.body.address;
    await vendorDetails.save();

    res.redirect('/vendor/profile');
}