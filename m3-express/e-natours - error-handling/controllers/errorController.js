const AppError = require(`${__dirname}/../utils/appError.js`);

const handleCastErrorDB = (err) =>{
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message,400);
}

const handleDuplicateFieldsDB = (err)=>{
    const value = err.message.match(/"([^"]*)"/)[0];
    const message =  `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message,400)
}

const handleValidationErrorDB = err =>{
    const errors = Object.values(err.errors).map(el => el.message);
    const message =  `Invalid input data ${errors.join(`. `)}`;
    return new AppError(message,400)
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    if (err.isOperational)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    else{
        console.error('ERROR 🍼🍼🍼 ',err);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong"
        });
    }
}



module.exports = function (err, req, res, next) {

    //each and every error get this stack trace - print entire call stack
    // console.log(err.stack); 

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development')
        sendErrorDev(err, res);
    
    else{

        if(err.name === 'CastError'){
            err_modi = handleCastErrorDB(err);
            sendErrorProd(err_modi, res);
        }

        if(err.code === 11000){
            err_modi = handleDuplicateFieldsDB(err);
            sendErrorProd(err_modi, res);
        }

        if(err.name === 'ValidationError'){
            err_modi = handleValidationErrorDB(err);
            sendErrorProd(err_modi, res);
        }

        else{
            sendErrorProd(err, res);
        }
    }
}