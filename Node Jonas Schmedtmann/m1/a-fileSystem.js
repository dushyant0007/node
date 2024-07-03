// when the modules are written in common-js (old module system we use require instead of import)
const fs = require('fs') 

fs.writeFileSync('./a-fileSystem.txt','this is the file data - 1 \n');
fs.appendFileSync('./a-fileSystem.txt','this is the file data - 2 \n');

const textIn = fs.readFileSync('./a-fileSystem.txt','utf-8');
console.log(textIn);

// * -- reading files async

fs.readFile('./a-fileSystem.txt','utf-8',(err,file_data)=>{
    console.log(file_data)
});
