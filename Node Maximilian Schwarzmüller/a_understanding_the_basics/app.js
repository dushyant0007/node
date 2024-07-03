const http = require('http');
const first_route = require('./routs')


/*
_____________________
Basic request.headers ->

    host: google.com
    accept: 'text/html,application/xhtml+xml,application/xml....
    accept-encoding: 'gzip,deflate,br'
    cookies:'_ga-GA1.1.922359435.1535...'

    req.url - /user/john etc ..
    req.method - GET etc..

______________________
Basic response.headers ->

    // To let browser know that we are sending text which is html in res's body
    res.setHeader('Content-Type','text/html')

    // to tell browser to redirect
    res.setStatusCode = 302
    // redirect to home_route ['/']
    res.setHeader('Location','/')

*/

const server = http.createServer(first_route);

server.listen(3000); 

                                