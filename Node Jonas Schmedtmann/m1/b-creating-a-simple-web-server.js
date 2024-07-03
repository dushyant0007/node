const http = require('http');

/*
createServer() - accept a callback function which is fired every time a request hits on server

*/
const server = http.createServer((request,response)=>{
    // req obj has all kinds of stuff ex- req url etc.
    // response obj gives us a lot of tools for sending out the response
    // console.log(request)
    // response.end('hello from the server');

    const path = request.url;
    //everything after http://127.0.0.1:2000 is path
    console.log(path);

    if(path === '/overview' ||path === '/')
        response.end('this is overview');
    else if(path === '/products')
        response.end('this is product');
    else{
        response.writeHead(404,{
            'Content-type':'text/html',
            'my-own-made-up-header':'hello-header',
        });
        response.end('<h1>Page Not Found</h1>')
    }

})

server.listen(2000,'127.0.0.1');

