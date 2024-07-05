const fs = require('fs');

function first_route (req,res) {
    // console.log(req)

    const url = req.url;
    const method = req.method;

    /* in its purest form a req/res has only two part -  header and body*/ 
    console.log(req.rawHeaders)

    if (url == '/'){
        
        // headers has to be defined first (before sending-res/res.write...etc )
        res.setHeader('Content-Type','text/html')

        res.write(
            // The form data will will sent res.body as key value pairs 
            //  key = userMessage
            //  value = valueOfInput
            `<html>
                <body>
                    <h1>Send Message To Dushyant !!<h1>
                    <form action="/message" method="POST"> 
                        <input type="text" name="userMessage" autocomplete="off" />
                        <button type="submit"> Send </button>
                    </form>
                </body>
            </html>
            `
        );
       
        return res.end()
    }

    if (url === '/message' && method === 'POST'){
        const req_body = []

        req.on('data',(chunk)=>{
            console.log(chunk)
            req_body.push(chunk)
        })

        req.on('end',()=>{

            const parse_body_str = Buffer.concat(req_body).toString();

            console.log(parse_body_str)
            
            fs.appendFile('userMessage.txt',parse_body_str+'\n',()=>{
                res.statusCode = 302;
                res.setHeader('Location','/') // redirecting to '/'
                return res.end()
            });
        }); 
    }
}

module.exports = first_route;