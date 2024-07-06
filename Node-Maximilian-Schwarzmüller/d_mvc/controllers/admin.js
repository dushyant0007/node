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

    const product = new Product(title,imageUrl,price,description)
    product.save()
    res.redirect('/');
}

module.exports.getEditProduct = (req, res, next) => {

    const productId = req.params.productId;
    const product = Product.findProductById(productId)

    if(!product)
        res.render('404.ejs',{pageTitle:"PageNotFount",path:''})

    else
    res.render('admin/edit-product.ejs',
        {
            pageTitle: "Edit Product",
            path: '/admin/edit-product',
            product:product
        });
}


module.exports.postEditProduct = (req, res, next) => {
    console.log(req.body)
    if(!Product.findProductById(req.body.productId))
        res.redirect('/error')

    req.body.id = req.body.productId
    Product.update(req.body)
    res.redirect('/admin/listed-products')
}




exports.getListedProducts =  (req, res, next)=>{
    const products = Product.fetchAll();
    
    res.render('admin/listed-products',{
        products: products,
        pageTitle:'Admin Products',
        path: '/admin/listed-products',
        hasProducts:products.length > 0,

    });
}
