
const Service = require('../../models/service')
const Booking = require('../../models/booking')
const stripe = require('stripe')('sk_test_51PjPncAixFmJRukEGsZfqF9TTt4wj6CigNwhSS4XLifVICVoJHWtr1fPORlK5EuZZ7BMl2Bbr307w8tFDjcqPWu700VBWwcdrw')

exports.postBook = async (req, res) => {
    const dates = req.body.dates;

    await Booking.create({ customerId: '66a755641943144e0606e810', serviceId: '66a7563a1943144e0606e828', dates, price: 399.5 });
    res.json({ message: 'Booking Successful' });
}



exports.getProfile = async (req, res) => {
    res.json('hi - getProfile')
}


exports.getCheckout = async (req, res) => {
    try {
        const service = await Service.findById(req.body.serviceId);
        const dates = req.body.dates;


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: service.serviceType,
                        description: `Booking dates ${dates.toString()}`
                    },
                    unit_amount: service.estimatedPrice * 100,
                },
                quantity: 1
            }],
            metadata: {
                customerId: req.user._id.toString(),
                serviceId: service._id.toString(),
                bookingDates: JSON.stringify(dates)
            },
            success_url: `https://33m4007x-3000.inc1.devtunnels.ms/shop/profile/checkout/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `https://33m4007x-3000.inc1.devtunnels.ms/shop/profile/checkout/cancel`,
        });

        // success_url: ${req.protocol}://${req.get('host')}/shop/profile/checkout/success/{CHECKOUT_SESSION_ID}`
        // cancel_url: `${req.protocol}://${req.get('host')}/shop/profile/checkout/cancel`,

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'An error occurred while creating the checkout session' });
    }
};

exports.getSuccess = async (req, res) => {
    const sessionId = req.params.sessionId;

    const isBookingAlreadyExistsWithThisSessionId = await Booking.findOne({ stripeSessionId: sessionId })

    if (!isBookingAlreadyExistsWithThisSessionId) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(session)
        await Booking.create({
            customerId: session.metadata.customerId,
            serviceId: session.metadata.serviceId,
            dates: JSON.parse(session.metadata.bookingDates),
            price: session.amount_total / 100,
            stripeSessionId: session.id,
            paymentStatus: session.payment_status,
            status: session.status,
        });
    }

    res.redirect('/shop/profile/bookings');
};

exports.getCancel = async (req, res) => {
    res.json('Payment Failed');
}

exports.getBookings = async (req, res) => {
    const bookings = await Booking.find({ customerId: req.user._id }).populate('serviceId', 'businessName serviceType');
    const pageData = { bookings }

    res.render('shop/bookings.ejs', { pageData, isUserAuthenticated: true });
};

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId).populate('serviceId');

        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        const formattedDates = booking.dates.map(date => new Date(date).toISOString().split('T')[0]);

        const pageData = {
            booking: {
                ...booking.toJSON(),
                dates: formattedDates
            }
        };

        res.render('shop/booking.ejs', { pageData, isUserAuthenticated: true });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).send('An error occurred while fetching the booking');
    }
}

exports.postReview = async (req, res) => {
    const bookingId = req.params.bookingId;

    const review = {
        userId: req.user._id,
        rating: req.body.rating,
        comment: req.body.comment,
        date: Date.now()
    }

    await Booking.findByIdAndUpdate(bookingId, { 'review': review  });

    res.redirect(`/shop/profile/bookings/${bookingId}`)

}