const Service = require('../../models/service')


exports.getDashboard = async (req, res, next) => {
    const services = await Service.find({ userId: req.user._id })
    res.render('vendor/dashboard.ejs', { services });
};


const serviceTypes = new Set(['photographer', 'videographer'])

exports.postAddNewService = async (req, res, next) => {

    const serviceType = req.body.serviceType;

    if (!serviceTypes.has(serviceType))
        return res.render('vendor/error.ejs', { error: `${serviceType} is not a valid service type` });

    const isAlreadyExists = await Service.findOne({ userId: req.user._id, serviceType: serviceType })

    if (isAlreadyExists) {
        return res.render('vendor/error.ejs', { Error: `You already have an existing ${serviceType}` })
    }

    await Service.create({ userId: req.user._id, serviceType: serviceType });

    return res.redirect('/vendor/dashboard');

};


exports.getEditService = async (req, res, next) => {
    const service = await Service.findOne({ _id: req.params.serviceId, userId: req.user._id, });
    return res.render(`vendor/service.ejs`, { service });

}


exports.postUpdateService = async (req, res, next) => {

    const serviceId = req.body.serviceId
    const updatedService = { ...req.body }
    delete updatedService.serviceId

    /*
        serviceActiveStatus has its value('true'/false) in string form -> The mongoose convert it automatically to boolean
    */

    await Service.updateOne({ _id: serviceId }, { $set: { ...updatedService } })

    res.redirect('/vendor/dashboard')

}

exports.getEditAlbums = async (req, res, next) => {
    const serviceId = req.params.serviceId
    res.render('vendor/edit_albums.ejs',{serviceId})
}


exports.postUpdateAlbum = async (req, res) => {

    if (req.error) {
        console.log(req.error);
        res.status(400).json({ message: 'Error uploading album' });
    } 
    else {
        
        const albumName = req.body.albumName;
        const files = req.files;
        const serviceId = req.body.serviceId;
    
        const fileNames = files.map(file => file.filename)
    

        const isAlbumAlreadyExists = await Service.findOne({_id: serviceId,['albums.' + albumName]: { $exists: true } })

        if(isAlbumAlreadyExists)
            await Service.findOneAndUpdate(
                {_id:serviceId},
                { $push:{['albums.' + albumName]: { $each: fileNames } }},
                { new: true }
            );
        else
            await Service.findOneAndUpdate(
                {_id:serviceId},
                { $set:{['albums.' + albumName]: fileNames }},
                { new: true }
            );
        

        res.json({ message: 'Album uploaded successfully', albumName,files });
    }
}



exports.getResource = async(req,res) => {
    
    // const filePath = req.query.fileName
    res.send('TEST MODE')

}