

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
    const userId = req.user.id

    Product.create({ userId, title, imageUrl, price, description })
        .then((result) => { 
            res.redirect('/admin/listed-products')
        })
        .catch((result) => { console.log(result) });
}

module.exports.getEditProduct = (req, res, next) => {

    const productId = req.params.productId;
    // Product.findByPk(productId)
    Product.findOne({where: {id:productId,userId:req.user.id}})
        .then((result) => {
            if(!result)
                throw Error(`User has no such product with id: ${productId}`,)
            else
                res.render('admin/edit-product.ejs',
                    {
                        pageTitle: "Edit Product",
                        path: '/admin/edit-product',
                        product: result
                    });
        })
        .catch((e) => {
            res.render('404.ejs', { pageTitle: 'wrong request', path: '',error:e })
        });
}

module.exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId
    // Product.findByPk(productId)    
    Product.findOne({where: {id:productId,userId:req.user.id}})
    .then((product) => {
        product.title = req.body.title
        product.price = req.body.price
        product.description = req.body.description
        product.imageUrl = req.body.imageUrl
        return product.save()
    })
    .then((result)=>{
        res.redirect('/admin/listed-products')
    })

    .catch(() => {
        res.render('404.ejs', { pageTitle: "PageNotFount", path: '' })
    })
}




exports.getListedProducts = (req, res, next) => {

    Product.findAll({ where:{userId:req.user.id},raw: true })
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
    if (req.body.productId) {
        Product.destroy({where:{id:req.body.productId}})
        res.redirect('/admin/listed-products')
    }
    else {
        res.redirect('/error')
    }
}

