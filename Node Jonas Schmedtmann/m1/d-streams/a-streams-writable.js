/*
Using writable Streams
Implementing writable Streams

Using Readable Stream
Implementing Readable Streams

Implementing Duplex  Streams
Using Duplex Streams

Implement Transform Streams
Using Transform Streams
*/


let fs = require('fs/promises')

data = `Hello, World!
 This is a sample text file created using a text editor or a programming language. You can use this file to store plain text, such as notes, messages, or any other information.
 
 Feel free to edit, modify, or add your own content to this file. TXT files are commonly used for storing textual data and can be easily opened and read by various text editors.
 
 Enjoy writing and experimenting with text files!
 `

async function MyWritable() {

    console.time('write_many');

    const fileHandler = await fs.open('./a.txt', 'w')
    const stream = fileHandler.createWriteStream()

    console.log(stream.writableHighWaterMark) // size of internal buffer
    console.log(stream.writableLength) // how much buffer is filled

    i = 0
    buff_fill_count = 0
    buff_c = ''
    makeWrite = ()=>{
        while(i < 1000000) {
            // break if the stream's internal buffer is full to give it time to write in file
            if (i === 999999){
                stream.end(`${i}`) 
                return
            }

            if (!stream.write(`${i} `+ buff_c)){
                buff_c = `\n buffer_fill_count : ${++buff_fill_count} \n`
                return 
            }
            else
                buff_c = ''

            i++
        }
    }

    makeWrite()

    // 'drain' event will be fired when the internal buffer is empty
    
    stream.on("drain",()=>{
        makeWrite()
    })


    stream.on('finish',()=>{
        console.timeEnd('write_many');
        fileHandler.close();
    })

}
MyWritable()

/*
Stream : an abstract interface for working with streaming data in Node.js

we wait for data to greater (write in buffer) and get big enough to be equal to a size of a chunk  (default is 16kB)
ans then we write
*/


 