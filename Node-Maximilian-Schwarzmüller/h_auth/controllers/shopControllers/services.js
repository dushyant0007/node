const Service = require('../../models/service')

exports.getServices = async (req, res) => {

    const services = await Service.find();
    const pageData = {services}
    // console.log(services)
    return res.render('shop/services.ejs',{pageData})

}

exports.getService = async (req,res) => {
   return res.json(`${req.params.serviceId}`)
};