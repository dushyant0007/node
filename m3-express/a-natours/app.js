const fs = require('fs')
const morgan = require('morgan')
const express = require('express');

const app = express();

//$ ------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////
//$ ------------------------------------------------------------------------------------------------


//$ -----------------------------------------------------------------


//morgan('dev') return a fun which print info about req
app.use(morgan('dev'));

//$ -----------------------------------------------------------------


// for parsing application/json // modify incoming data
// express.json returns a function and that function is then added to middleware stack
app.use(express.json());

//$ -----------------------------------------------------------------

//creating our own middleware fun
app.use((req,res,next)=>{
    console.log('Hello from the middleware 👋');
    //if we don'e next fun then the req-res cycle get stuck at this point
    next();
});

//$ -----------------------------------------------------------------

app.use((req,res,next)=>{
    //adding new property in req obj
    req.requestTime = new Date().toISOString();
    next();
})

//$ -----------------------------------------------------------------

//creating router
const tourRouter = express.Router();
app.use('/tourRouter',tourRouter);
tourRouter.get('/',(req,res)=> res.end('tourRouter Success'));

//$ ------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////
//$ ------------------------------------------------------------------------------------------------




const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
////////////////////////////////////////////////////////////////////////////////
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//*========================================================


const getHome  = function(req,res){
    //the .json ends the req-res cycle
    res.status(200)
        .json({
            message: 'Hello from the server',
            app: 'Natours'
        })
}

//*======================================================


const postHome  = function(req,res){
    res.send('you can post ot this endpoint')
}


//*======================================================


const getTours = (req, res) => {
    res.status(200)
        .json({
            statue: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
}


//*======================================================


const getTour = (req, res) => {

    console.log(req.params);

    if (+req.params.id >= tours.length)
        return res.status(404).end('data not found');

    else
        res.json({
            status: 'success',
            data: {
                tour: tours.find((tour) => tour.id == req.params.id)
            }
        });
}

//*======================================================

 
const postTour = (req, res) => {
    console.log(req);
    console.log(req.body);
    res.send('done')
}


//*======================================================


const updateTour = (req, res) => {
    res.status(200).json({
        status: 'updated',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

//*======================================================


const deleteTour =(req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    })
}

//*======================================================


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//////////////////////////////////////////////////////////////////////////////////////////
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// app.get('/', getHome)
// app.post('/',postHome)
app.route('/').get(getHome).post(postHome);

// ++++++++++++++++++

// app.get('/api/v1/tours', getTours);
// app.post('/api/v1/tours', postTour);
app.route('/api/v1/tours').get(getTours).post(postTour);

// ++++++++++++++++++

//:id is a variable and available in req.params obj
//by adding ? in :x? the parameter becomes optional
app.get('/api/v1/tours/:id/:x?', getTour);

// ++++++++++++++++++

// with PUT app accept entire new obj to update
// with PATCH app accept only the properties to be updated on obj
app.patch('/api/v1/tours/:id', updateTour)


// ++++++++++++++++++


app.delete('/api/v1/tours/:id', deleteTour)


// ++++++++++++++++++


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/////////////////////////////////////////////////////////////////////////////
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



app.listen(1100, '127.0.0.1', () => {
    console.log('app running on port 1100');
});