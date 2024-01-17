class APIFeatures{
    constructor(query,queryObject){

        this.query = query;
        this.queryObject = queryObject;
      
    }

    filter(){
        
        let queryObject = { ...this.queryObject };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObject[el])

        // ?duration[gte]=4 -> queryObj:{duration:{gte:'4'}}
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|ge|lt|lte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr))

        
        return this;
    }

    sort(){

        
        // 'price, -duration', 1 ->ascending, -1 ->descending
        if (this.queryObject.sort) {
            // ex - localhost:3000/api/v1/tours?duration[gte]=7&sort=price,-ratingAverage / gte:graterTheEqualTo
            const sortBy = this.queryObject.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            // works even if the createdAt is (select:false) in model
            this.query = this.query.sort('-createdAt')
        }

        
        return this;
    }

    limitingFields(){

        // ex - localhost:3000/api/v1/tours?fields=name,duration,difficulty,price

        if (this.queryObject.fields) {
            const fields = this.queryObject.fields.split(',').join(' '); // 'name duration price'
            this.query = this.query.select(fields)
        }
        else {
            // (-name) excluding
            this.query = this.query.select('-__v')
        }

        return this;
    }

    pagination(){
        const pageLimit = parseInt(this.queryObject.limit) || 10;
        const pageNumber = parseInt(this.queryObject.page) || 1;

        const skipPages = (pageNumber - 1) * pageLimit;
        
        // page=2&limit=10
        this.query = this.query.skip(skipPages).limit(pageLimit);

        
        return this;
    }

}


module.exports  = APIFeatures;