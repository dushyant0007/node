const express = require('express');
const morgan = require('morgan');
const AppError = require(`${__dirname}/utils/appError.js`)
const globalErrorHandler = require(`${__dirname}/controllers/errorController.js`)



//=================================================================


const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
 

//=================================================================


// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//=================================================================


// accessing static files
// host/-fileNameInPublicDir-
// host/public/file-name is not because when we open up a url
// that it cant find in any of the route it will then look in that public folder
// ex - http://localhost:3000/img/pin.png
// it kind of sets the the public folder as root
app.use(express.json());
app.use(express.static(`${__dirname}/public`));


//=================================================================


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


//=================================================================


// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


//=================================================================

// Handling Unhandled Routs
// all for all http methods (get/post/...)
app.all("*",(req,res,next)=>{

  // res.status(404).json({
  //     status:"fail",
  //     message:`Cannot ${req.originalUrl} at this route!`;
  // });

  // const err = new Error(`Can't find ${req.originalUrl} at this route!`)
  // err.status = 'fail';
  // err.statusCode = 404;

  // the next fun take error as arg - if we passed the err - then it will skip all the other
  // middleware in the middleware stack and send the error that we passed in to out global error handling middleware
  // next(err);

  // ---
  
  next(new AppError(`Cannot ${req.originalUrl} at this route!`,404))
  

});


//global error Handling middleware
app.use(globalErrorHandler);


module.exports = app;
