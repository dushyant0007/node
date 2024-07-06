const fs = require('fs')
const path = require('path')

const pth = path.join(__dirname, 'products.json');


module.exports = class Product {

    constructor(title, imageUrl, price, description) {

        this.title = title;
        this.imageUrl = imageUrl
        this.description = description
        this.price = price

    }


    save() {
        this.id = Math.random().toString().substring(2);
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

    static update(updatedProduct) {

        const productsJson = JSON.parse(fs.readFileSync(pth));
        const updateProductIdx = productsJson.findIndex((product) => product.id == updatedProduct.productId)
        productsJson[updateProductIdx] = updatedProduct

        fs.writeFileSync(pth, JSON.stringify(productsJson), (err) => {
            console.log(err)
        })

    }

    static fetchAll() {
        return JSON.parse(fs.readFileSync(pth));
    }

    static findProductById(id) {
        return Product.fetchAll().find((product) => product.id == id)
    }

}