const Product = require("../models/products");

//user 
module.exports.allActiveProducts = (req, res) => {
    Product.find({ isActive: true}, (err, foundProduct) =>{
        if(foundProduct){
            res.send(foundProduct)
        }else{
            console.log(err);
        }
    })
};

//user
module.exports.oneActiveProduct = (req, res) => {
    Product.findOne({ _id: req.params.productId }, (err, foundProduct)=> { 
        if(foundProduct && foundProduct.isActive){
            res.send(foundProduct);
        } else {
            res.send(false);
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
            res.send(false);
        }
    }) 
};

//admin
module.exports.createProduct = (req, res) => {
        Product.findOne({ name: req.body.name }, (err, foundProduct) => {
            if(foundProduct){
                res.send(false)
            } else {
                let newProduct = new Product({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price
                });

                newProduct.save()
                .then(addedProduct => {
                    res.send(addedProduct)
                }).catch(err => {
                    console.log(err);
                })
            }
        })
}

//admin
module.exports.updateProduct = (req, res) => {
    console.log(req.body)
        Product.findByIdAndUpdate({_id: req.params.productId}, {$set: req.body}, {new:true}, (err, updatedProduct) => {
            if(err){
                console.log(err);
            } else {
                console.log(updatedProduct);
                res.send(updatedProduct);
            }
        })
};

//admin
module.exports.storeProduct = (req, res) => Product.findByIdAndUpdate({_id: req.params.productId}, {$set: { isActive: true }}, { new:true }, (err, storedProduct) => (err) ? console.log(err) : res.send(true));

//admin
module.exports.archiveProduct = (req, res) => Product.findByIdAndUpdate({ _id: req.params.productId }, { $set: { isActive: false } }, { new: true }, (err, archivedProduct) => (err) ? console.log(err) : res.send(true));