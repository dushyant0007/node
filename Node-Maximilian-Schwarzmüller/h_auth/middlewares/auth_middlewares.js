
function isVenderAuthenticated(req, res, next) {
    if (!req.session.user || req.session.user.userType != 'vendor') {
        console.log(req.session.user, 'auth-middleware')
        return res.redirect('/vendor/auth/login');
    }
    else
        next();
}

function isVenderNotAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.userType == 'vendor') {
        console.log(req.session.user, 'auth-middleware')
        return res.redirect('/vendor/dashboard');
    }
    else
        next();
}



function isCustomerAuthenticated(req, res, next) {
    if (!req.session.user || req.session.user.userType != 'customer') {
        console.log(req.session.user, 'auth-middleware -a')
        return res.json({url:'/shop/auth/login'});
    }
    else
        next();
}
function isCustomerNotAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.userType == 'customer') {
        console.log(req.session.user, 'auth-middleware -b')
        return res.redirect('/shop/home');
    }
    else
        next();
}


module.exports = {
    isVenderAuthenticated,
    isVenderNotAuthenticated,

    isCustomerAuthenticated,
    isCustomerNotAuthenticated
}