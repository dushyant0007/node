const { Collection } = require('mongoose');
const Service = require('../../models/service')

exports.getDashboard = async(req,res,next) => {

    if(!req.session.user)
        return res.redirect('/vender/login');

    console.log(req.body)

    const services = await Service.find({userId:req.user._id})

    res.render('vender/dashboard.ejs',{services});
};


const serviceTypes = new Set(['photographer','videographer'])
exports.postAddNewService = async (req,res,next) => {
    const serviceType = req.body.serviceType;
    
    if(!serviceTypes.has(serviceType))
        return res.render('vender/error.ejs',{error:`${serviceType} is not a valid service type`});

    const isAlreadyExists = await Service.findOne({userId:req.user._id,serviceType:serviceType})

    if(isAlreadyExists){
        return res.render('vender/error.ejs',{Error:`You already have an existing ${serviceType}`})
    }

    await Service.create({userId:req.user._id,serviceType:serviceType});

    return res.redirect('/vender/dashboard');
    
};

exports.postGetEditService = async (req,res,next) => {
    if(!req.session.user)
        return res.redirect('/vender/login');
    
    const service = await Service.findOne({_id:req.body.serviceId,userId:req.user._id,});

    console.log(service)
    
    return res.render(`vender/service.ejs`,{service});

}

exports.postUpdateAlbum = async (req,res,next) => {

    

    res.json('album upload status : Successful')
}

exports.postUpdateService = async (req,res,next) => {
    
    const serviceId = req.body.serviceId
    const updatedService = {...req.body}
    delete updatedService.serviceId
    
    /*
        serviceActiveStatus has its value('true'/false) in string form -> The mongoose convert it automatically to boolean
    */ 

    await Service.updateOne({_id:serviceId},{$set:{...updatedService}})
    
    res.redirect('/vender/dashboard')

}

exports.postTemp = async(req,res,next) => {

    // const data = await req.json()
    // console.log(data)

    res.redirect('/vender')
}