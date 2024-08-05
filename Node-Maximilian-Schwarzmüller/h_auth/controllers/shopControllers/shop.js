const Service = require('../../models/service');
const Booking = require('../../models/booking');



exports.getHome = (req,res)=>{
    const isUserAuthenticated = (req.user) ? true : false;
    res.render('shop/home.ejs',{isUserAuthenticated})
}

exports.getServices = async (req, res) => {
    const services = await Service.find({serviceActiveStatus:true});
    const pageData = { services }

    const isUserAuthenticated = (req.user) ? true : false;
    return res.render('shop/services.ejs', { pageData,isUserAuthenticated })

}

exports.getService = async (req, res) => {
    const service = await Service.findById(req.params.serviceId);
    const pageData = { service }

    const isUserAuthenticated = (req.user) ? true : false;
    return res.render('shop/service.ejs', { pageData,isUserAuthenticated })
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


