const fs = require('fs');
const url = require('url');
const http = require('http');

const slugify = require('slugify');

const replaceTemplate = require(`${__dirname}/modules/replaceTemplate.js`);

// ^ -----------------------

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//^----
const slugs = dataObj.map(el => slugify(el.productName,{tower:true}) );
console.log(slugs)
//^----

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-overview-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// ^ -----------------------

const server = http.createServer((request, response) => {

    //true to parse the query part into an object
    //query - obj of all variables after ? ;
    //pathName = between http://127.0.0.1:2000 and ?
    const {query,pathname} = url.parse(request.url,true);
    console.log(pathname)

    //OVERVIEW PAGE
    if (pathname === '/overview' || pathname === '/') {

        response.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsOverview = dataObj.map((el) => {
            return replaceTemplate(tempCard, el)
        }).join('');

        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsOverview);

        response.end(output);
    }

    //PRODUCT PAGE
    else if (pathname == '/product'){
        response.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product =  dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        
        response.end(output);
    }

    //API PAGE
    else if (pathname === '/api') {

        response.writeHead(200, {
            'Content-type': 'application/json'
        })
        response.end(data);
    }

    //PAGE NOT FOUND
    else {

        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-made-up-header': 'hello-header',
        });
        response.end('<h1>Page Not - Found</h1>')
    }

});

server.listen(2000, '127.0.0.1');

