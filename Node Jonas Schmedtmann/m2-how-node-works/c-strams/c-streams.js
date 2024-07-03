const fs = require('fs');
const server = require('http').createServer();

//we need to read a large txt file form our system and then send to the client
server.on('request',(req,res)=>{
    //solution 1
    // fs.readFile('a.txt',(err,data)=>{
    //     if (err) throw err;
    //     res.end(data);
    // });

    /*
    solution 2: Stream
     our readable stream is much faster then sending the result with 
     response writable stream over the network
     */

    // const readable = fs.createReadStream('a.txt');
    // readable.on('data',chunk => {
    //     //response is a writable stream
    //     res.write(chunk);
    // })

    // readable.on('end',()=>{
    //     console.log('stream-end')
    //     res.end();
    // })

    // readable.on('error',err=>{
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found');
    // })

    //solution 3

    const readable = fs.createReadStream('a.txt');
    //readableSource.pipe(writeableDestination)
    readable.pipe(res);

});

server.listen(1100,'127.0.0.1');