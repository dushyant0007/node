const express = require('express');
const morgan = require('morgan');



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


module.exports = app;
