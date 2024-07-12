
exports.getLogin = (req,res,next) => {

    let isLoggedIn = req.get('Cookie').split(';').filter(c => c.startsWith('isLoggedIn')).toString()

    if(isLoggedIn){
        console.log(typeof isLoggedIn)
        isLoggedIn = isLoggedIn.split("=")[1]
        console.log(isLoggedIn)
    }

    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        isAuthenticated: (isLoggedIn ? true : false)
    })
}

exports.postLogin = (req,res,next) => {
    req.isLoggedIn = true;
    res.setHeader('set-Cookie','isLoggedIn=true','Max-Age=10')
    res.redirect('/')
}