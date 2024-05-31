const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = this.request('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss') 
const hpp = require('hpp')


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

//Set Security Http headers
app.use(helmet())

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// max 100 req per hour
const limiter = rateLimit({
  max : 100,
  windowMs : 60 * 60 * 1000, // 1 House
  message:'Request limit is exceeded'
})
app.use('/api',limiter);  

// Body parser # reading data from body --then putting into --> req.body
app.use(express.json({limit:'10kb'})); // limiting the amount of data that comes in the body


// Data sanitization against NoSQL query induction
app.use(mongoSanitize());

// Data sanitization against XSS (cross site scripting)
app.use(xss()); // clean any user input from a malicious html code

// To remove duplicate fields from query string / prevent parameter pollution
app.use(hpp({whitelist:['duration','ratingsQuantity','ratingAverage','maxGroupSize','difficulty','price']}))

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;