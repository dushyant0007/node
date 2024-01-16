module.exports = function(err, req, res, next){  

    //each and every error get this stack trace - print entire call stack
    // console.log(err.stack); 
    
    err.statusCode =  err.statusCode || 500 ;
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status : err.status,
      message: err.message
    });
  
  }