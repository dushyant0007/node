const http = require('http');
const express = require('express');
const body_parser = require('body-parser')
const first_route = require('./routs')


/*
    express req/res flow

    -------------------------
    |       Request         |
    -------------------------
              ⬇
    -------------------------
    |       Middleware       |    (res,req,next)_=> { ... }
    -------------------------
              ⬇ next()
    -------------------------
    |       Middleware       |    (res,req,next)_=> { ... }
    -------------------------
              ⬇ res.send()
    -------------------------
    |       Response         |
    -------------------------

*/ 

const app = express()

// req.body = concat chucks from stream and parsing in key-val paris
app.use(body_parser.urlencoded({extended:false}))

// .use allow use to add middleware functions
app.use('/',(req,res,next)=>{
    console.log("Middle ware #1 ")

    // To allow the req to travel on to the next middleware inline
    next();
    /*
        if we don't call next - we should send response else 
            browser loading wheel will keep spinning
    */ 

});

app.use('/',(req,res,next)=>{
    console.log("Middle ware #2 ")
    res.send("Home Page")
})

app.use('/add-product',(req,res,next)=>{
    console.log("Middle ware #3 ")

    // automatically sets the content-type header
    res.send(`
        <form action="/product" method="POST">
            <input type="text" name="title"/> 
            <button type="submit">Add Product</button>
        </form>
    `)
}) 

//only fire for post request instead of all types of requests
// expect app.use trigger only with exact match of route
app.post('/product',(req,res,next)=>{
    console.log("Middle ware #4 ")

    console.log(req.body)

    // setting status-code and location header
    res.redirect('/');
})


app.use('/test',(req,res,next)=>{
    console.log("Middle ware #5")

    // automatically sets the content-type header
    res.send("<h1>Hello</h1>")
})


app.use('/hi-dj',(req,res,next)=>{
    first_route(req,res)
})



// const server = http.createServer(app);
// server.listen(3000); 
// or (same thing)
app.listen(3000);

                                