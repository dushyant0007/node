const Product = require('../models/product')

module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs',
        {
            pageTitle: "add-product",
            path: '/admin/add-product',
        });
}

exports.postAddProduct = (req, res, next) => {

    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id

    const new_product = new Product(title, imageUrl, price, description,userId)
    Product.save(new_product)
        .then((result) => {
            // res.redirect('/admin/listed-products')
            res.redirect('/products')
        })
        .catch((result) => { console.log(result) });
}

module.exports.getEditProduct = (req, res, next) => {

    const productId = req.params.productId;
    // Product.findByPk(productId)
    Product.findById(productId)
        .then((product) => {
            if (!product)
                throw Error(`User has no such product with id: ${productId}`,)
            else
                res.render('admin/edit-product.ejs',
                    {
                        pageTitle: "Edit Product",
                        path: '/admin/edit-product',
                        product: product
                    });
        })
        .catch((e) => {
            res.render('404.ejs', { pageTitle: 'wrong request', path: '', error: e })
        });
}

module.exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId
    const updatedProduct = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description)
    // Product.findByPk(productId)    
    Product.updateById(productId, updatedProduct)
        .then(() => {
            console.log('product updated successfully')
            res.redirect('/admin/listed-products')
        })
        .catch(() => {
            res.render('404.ejs', { pageTitle: "PageNotFount", path: '' })
        })
}




exports.getListedProducts = (req, res, next) => {

    Product.fetchAll()
        .then((result) => {
            res.render('admin/listed-products', {
                products: result,
                pageTitle: 'Admin Products',
                path: '/admin/listed-products',
                hasProducts: result.length > 0
            });
        })
        .catch(error => { console.log(error) })

}

exports.deleteListedProduct = (req, res, next) => {
    const productId = req.body.productId;
    if (productId) {
        Product.deleteById(productId)
            .then(()=>{
                console.log('product deleted successfully');
                res.redirect('/admin/listed-products')
            })
            .catch (error => {
                console.log(error)
            })
    }
    else {
        res.redirect('/error')
    }
}

