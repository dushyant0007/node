const fs = require('fs')
const path = require('path')

module.exports = class product {
    constructor(title) {
        this.title = title;
    }


     save() {
        const pth = path.join(__dirname, 'products.json');
        fs.readFile(pth, (err, fileContentBuff) => {
            let products = []
            if (!err) {
                products = JSON.parse(fileContentBuff)
            }
            products.push(this);

            fs.writeFile(pth, JSON.stringify(products), (err) => {
                console.log(err)
            })
        })
    }

    static fetchAll() {

        const pth = path.join(__dirname, 'products.json')
        
        return JSON.parse(fs.readFileSync(pth));

        
    }

}