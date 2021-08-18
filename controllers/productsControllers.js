const Product = require("../models/products");

//user 
module.exports.allActiveProducts = (req, res) => {
    Product.find({ isActive: true})
    .then(foundProduct => {
        res.send(foundProduct);
    }).catch(err => {
        console.log(err);
    });
};

//user
module.exports.oneActiveProduct = (req, res) => {
    Product.findOne({ _id: req.params.productId }, (err, foundProduct)=> { 
        if(foundProduct && foundProduct.isActive){
            res.send(foundProduct);
        } else {
            res.send(`Sorry, product is not available.`);
        }
    })
};

//admin
module.exports.allProducts = (req, res) => {
    Product.find({})
    .then(foundProduct => {
            res.send(foundProduct);
    }).catch(err => {
        console.log(err);
    });
};

//admin
module.exports.oneProduct = (req, res) => {
    Product.findOne({ _id: req.params.productId },(err, foundProduct) =>{
        if(foundProduct){
            res.send(foundProduct);
        } else {
            res.send(`Sorry, product is not available.`);
        }
    }) 
};

//admin
module.exports.createProduct = (req, res) => {
    if(req.body.name && req.body.description && req.body.price){
        Product.findOne({ name: req.body.name }, (err, foundProduct) => {
            if(foundProduct){
                res.send(`Product ${req.body.name} already exists!`)
            } else {
                let newProduct = new Product({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price
                });

                newProduct.save()
                .then(addedProduct => {
                    res.send(`${req.body.name} successfully added to products.`)
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }
}

//admin
module.exports.updateProduct = (req, res) => {
    if(req.body) {
        Product.findByIdAndUpdate({_id: req.params.productId}, {$set: req.body}, {new:true}, (err, updatedProduct) => {
            if(err){
                console.log(err);
            } else {
                res.send(updatedProduct);
            }
        })
    } else {
        res.send(`All fields are required!`);
    }
};

//admin
module.exports.storeProduct = (req, res) => Product.findByIdAndUpdate({_id: req.params.productId}, {$set: {isActive: true}}, { new:true }, (err, storedProduct) => (err) ? console.log(err) : res.send(`Product with the following details has been stored: ${storedProduct}`));

//admin
module.exports.archiveProduct = (req, res) => Product.findByIdAndUpdate({ _id: req.params.productId }, { $set: { isActive: false } }, { new: true }, (err, archivedProduct) => (err) ? console.log(err) : res.send(`Product with the following details has been archived: ${archivedProduct}`));