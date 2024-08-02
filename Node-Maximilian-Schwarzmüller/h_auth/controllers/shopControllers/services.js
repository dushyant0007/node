const Service = require('../../models/service');
const Booking = require('../../models/booking');

exports.getServices = async (req, res) => {

    const services = await Service.find();
    const pageData = {services}
    console.log(services)
    return res.render('shop/services.ejs',{pageData})

}

exports.getService = async (req,res) => {
    const service = await Service.findById(req.params.serviceId);
    const pageData = {service}
   return res.render('shop/service.ejs',{pageData,arrow:'-><-'})
};


exports.getDates = async (req, res) => {
    try {
        const bookings = await Booking.find({ serviceId: req.params.serviceId }, { dates: 1 });
        let bookedDates = [];

        bookings.forEach(booking => {
            bookedDates = bookedDates.concat(booking.dates.map(date => new Date(date).toISOString().split('T')[0]));
        });

        const data = { booked: bookedDates };
    
        return res.json(data);
    } catch (error) {
        console.error('Error fetching dates:', error);
        return res.status(500).json({ error: 'Error fetching dates' });
    }
};

exports.postBook = async (req,res) => {
    console.log('hook')
    const dates = req.body.dates;
    
    await Booking.create({customerId:'66a755641943144e0606e810',serviceId:'66a7563a1943144e0606e828',dates,price:399.5});
    res.json({message:'Booking Successful'});
}
