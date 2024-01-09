const fs = require('fs');
const Tour = require(`../models/tourModel`);


exports.aliasTopTours = (req,res,next)=>{

    // ?limit=5&sort=price,-ratingAverage
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty'

    next();
}


exports.getAllTours = async (req, res) => {

    try {

        // req.query -> return obj containing data form query string  [?duration=1&difficulty=easy&page=2]
        //console.log(req.query)

        //^ BUILD QUERY
        /*
        the sorting,filtering,selecting operation is performed by MongoDB itself when executing 
        the query against the database.
        */

        ///////////// ///////////// ///////////// ///////////// ///////////// /////////////
        // 1) Filtering


        let queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el])


        ///////////// ///////////// ///////////// ///////////// ///////////// /////////////
        // 2) Advance filtering 
        
        
        // ?duration[gte]=4 -> queryObj:{duration:{gte:'4'}}

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|ge|lt|lte)\b/g, match => `$${match}`)
        queryObj = JSON.parse(queryStr);

        // this find method return a query obj, that is the reason we can chain the functions
        let query = Tour.find(queryObj);


        ///////////// ///////////// ///////////// ///////////// ///////////// /////////////
        // 3) Sorting


        // 'price, -duration', 1 ->ascending, -1 ->descending
        if (req.query.sort) {
            // ex - localhost:3000/api/v1/tours?duration[gte]=7&sort=price,-ratingAverage / gte:graterTheEqualTo
            sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else {
            // works even if the createdAt is (select:false) in model
            query = query.sort('-createdAt')
        }


        ///////////// ///////////// ///////////// ///////////// ///////////// /////////////
        // 4) Field limiting / also called projection/selection

        // ex - localhost:3000/api/v1/tours?fields=name,duration,difficulty,price

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' '); // 'name duration price'
            query = query.select(fields)
        }
        else {
            // (-name) excluding
            query = query.select('-__v')
        }

        ///////////// ///////////// ///////////// ///////////// ///////////// /////////////
        // 5) PAGINATION 

        
        const pageLimit = parseInt(req.query.limit) || 10;
        const pageNumber = parseInt(req.query.page) || 1;
        

        const skipPages = (pageNumber - 1) * pageLimit;
        
        // page=2&limit=10
        query = query.skip(skipPages).limit(pageLimit)

        if(req.query.page){
            const numTours = await Tour.countDocuments();
            if(skipPages >= numTours)
                throw new Error('this page does not exists')
        }

        //^ EXECUTING QUERY
        //query.sort().select().skip(),limit();
        const tours = await query;


        // const tours =await Tour.find()
        // .where('duration')
        // .lt(4)
        // .where('difficulty')
        // .equals('easy')

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    }
    catch (err) {
        res.status(404).json({ statue: 'fail', message: { err } })
    }
};

exports.getTour = async (req, res) => {


    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }
    catch (err) {
        res.status(404).json({ statue: 'fail', message: { err } })
    }
};

exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    }
    catch (err) {

        res.status(400).json({
            status: 'fail',
            message: (String(err)),
        })
    }

};

exports.updateTour = async (req, res) => {

    try { // new:true / new update document is returned
        const tour = await Tour
            .findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {

        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });

    }
    catch (err) {

        res.status(404).json({
            status: 'fail',
            message: err
        });

    }
};
