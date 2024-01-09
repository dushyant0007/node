const EventEmitter = require('events');


const myEmitter = new EventEmitter();

myEmitter.on('newSale',()=>{
    console.log('there was a new sale');
});

myEmitter.on('newSale',()=>{
    console.log('The customer bill of 200$');
});

myEmitter.on('newSale',stock=>{
    console.log(`There are ${stock} items recaning in stock`);
});

myEmitter.emit('newSale',9);


class Sales extends EventEmitter {
    constructor(){
        super();
    }
    
}


//^ ---------------------------------------------------------------------
//////////////////////////////////////////////////


const saleToday = new Sales();

saleToday.on('newSale',()=>{
    console.log('saleToday - there was a new sale');
});

saleToday.on('newSale',()=>{
    console.log('saleToday - The customer bill of 200$');
});

saleToday.on('newSale',stock=>{
    console.log(`saleToday - There are ${stock} items recaning in stock`);
});

saleToday.emit('newSale',9);

//^ ---------------------------------------------------------------------
//////////////////////////////////////////////////

const http = require('http');

const server = http.createServer();

server.on('request',(req,res)=>{
    console.log('request received');
    console.log(req.url);
    res.end('request received')
});

server.on('request',(req,res)=>{
    console.log('--listing twice for same event')
});

server.on('close',()=>{
    console.log('server closed');
    res.end('server closed');
})

server.listen(1100,'127.0.0.1',()=>{
    console.log('listening on port 1100');
});