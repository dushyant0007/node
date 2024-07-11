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

    const new_product = new Product({ title, imageUrl, description, price,userId })
    new_product.save(new_product)
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
    Product.findById(productId)
        .then(product => {
            product.title = req.body.title
            product.imageUrl = req.body.imageUrl
            product.price = req.body.price
            product.description = req.body.description
            product.save()
        })
        .then(() => {
            console.log('product updated successfully')
            res.redirect('/admin/listed-products')
        })
        .catch(() => {
            res.render('404.ejs', { pageTitle: "PageNotFount", path: '' })
        })
}

exports.getListedProducts = (req, res, next) => {
 
    Product.find({userId:req.user._id})
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
        Product.findByIdAndDelete(productId)
            .then(() => {
                console.log('product deleted successfully');
                res.redirect('/admin/listed-products')
            })
            .catch(error => {
                console.log(error)
            })
    }
    else {
        res.redirect('/error')
    }
}

