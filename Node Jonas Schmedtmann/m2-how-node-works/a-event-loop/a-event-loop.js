const fs = require('fs');
const crypto = require('crypto')

setTimeout(()=> console.log('timer 1 finished'),0);
setImmediate(()=>console.log('immediate 1 finished'))

const start = Date.now();

//by default the size of thread pool is 4 to change that 
//UV stands for libuv
process.env.UV_THREADPOOL_SIZE = 1;

fs.readFile('a.txt', (err,data)=>{
    if(!err){
        console.log('I/O finished');

        setTimeout(()=> console.log('timer 2 finished'),0);
        setTimeout(()=> console.log('timer 3 finished'),3000);
        setImmediate(()=>console.log('immediate 2 finished'));

        process.nextTick(()=> console.log('process.nextTick'));


        crypto.pbkdf2('password','key-salt',100000,1024,'sha512',()=>console.log('password encrypted',Date.now()-start))
        crypto.pbkdf2('password','key-salt',100000,1024,'sha512',()=>console.log('password encrypted',Date.now()-start))
        crypto.pbkdf2('password','key-salt',100000,1024,'sha512',()=>console.log('password encrypted',Date.now()-start))
        crypto.pbkdf2('password','key-salt',100000,1024,'sha512',()=>console.log('password encrypted',Date.now()-start))
    }
    else
        console.log(err)
})

console.log('Hello from top level code');

