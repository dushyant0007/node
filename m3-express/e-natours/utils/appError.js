class AppError extends Error{

        constructor(message,statusCode){
            super(message);

            console.log(message,'=====--=======------===')

            this.statusCode = statusCode;
            this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

            /*
            so all of out errors will get this property set to true, so we can then test for 
            this property and only send error messages back to client for these operational errors
            that we created using this class.
            this is useful because some other crazy unexpected errors that might happen 
            in our application for example a programming error or some bug in one the the packages
            that we require into our app, and these errors will then of course not have have this
            .isOperational property on them 
            */
            this.isOperational = true;

            // we want to preserve the stack trace of the error and also at the same this
            // not add this class to that stack trace.
            // so this way when a new object is created and a constructor function is called
            // then that function call is not gonna appear in the stack trace, and will no pollute it
            Error.captureStackTrace(this,this.constructor);
        }
}

module.exports =  AppError;