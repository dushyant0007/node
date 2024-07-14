
exports.getDashboard = (req,res,next) => {
    if(!req.session.user)
        return res.redirect('/vender/login');

    res.render('vender/dashboard.ejs');
};


const serviceTypes = new Set(['photographer','videographer'])
exports.postAddService = (req,res,next) => {
    const serviceType = req.body.serviceType;

    console.log(serviceType)
    
    if(!serviceTypes.has(serviceType))
        return res.render('vender/error.ejs',{error:`${serviceType} is not a valid service type`});

    return res.render(`vender/serviceTypes/${serviceType}.ejs`);
    
};

exports.postAddServiceServiceName = (req,res,next) => {
    const serviceType = req.params.serviceType;

    return res.send('hi')
}