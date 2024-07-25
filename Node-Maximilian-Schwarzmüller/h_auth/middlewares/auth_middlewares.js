
function isVenderAuthenticated(req,res,next) {
    if (!req.session.user || req.session.user.userType != 'vendor') {
        console.log(req.session.user)
        return res.redirect('/vendor/login');
    }
    else
        next();
}

function isVenderNotAuthenticated(req,res,next) {
    if (req.session.user && req.session.user.userType == 'vendor') {
        console.log(req.session.user)
        return res.redirect('/vendor/dashboard');
    }
    else
        next();
}



function isCustomerAuthenticated(req,res,next) {
    if (!req.session.user || req.session.user.userType != 'customer') {
        console.log(req.session.user)
        return res.redirect('/shop/login');
    }
    else
        next();
}
function isCustomerNotAuthenticated(req,res,next) {
    if (req.session.user && req.session.user.userType == 'customer') {
        console.log(req.session.user)
        return res.redirect('/shop');
    }
    else
        next();
}


module.exports = {isVenderAuthenticated,isVenderNotAuthenticated}