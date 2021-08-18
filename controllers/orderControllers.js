const User = require("../models/user");
const Product = require("../models/products");
const Order = require("../models/order");

//user
module.exports.userOrder = (req, res) => {
    Order.findOne({userId: req.decodedUser.id}, (err, foundOrder)=> {
        if(foundOrder){
            res.send(foundOrder);
        } else {
            res.send(`Empty Order`);
        }
    })
}

//admin
module.exports.allOrder = (req, res) => {
    Order.find({})
    .then(foundOrder => {
        res.send(foundOrder);
    }).catch(err => {
        console.log(err);
    })
}

module.exports.createOrder = (req, res) =>{
        User.findOne({_id: req.decodedUser.id}, (err, foundUser)=>{
            if(foundUser.userCart.length > 0){
                let cartTotal = foundUser.userCart.map(product => {return product.subtotal});
                cartTotal = cartTotal.reduce((initialValue, currentValue) => {return initialValue + currentValue});
                console.log(cartTotal);
                let productQuantity = foundUser.userCart.map(productQuantity => {return productQuantity.quantity});
                productQuantity = productQuantity.reduce((initialValue, currentValue) => {return initialValue + currentValue})
                let newOrder = new Order({
                    userId: req.decodedUser.id,
                    quantity: productQuantity,
                    totalAmount: cartTotal,
                    order: [
                        {
                            productId: foundUser.userCart.productId,
                            productName: foundUser.userCart.productName
                        }
                    ]
                })
                foundUser.orders.push({orderId: newOrder._id})

                let productId = foundUser.userCart.map(product => {return product.productId});
                for(let i = 0; i < productId.length; i++){
                    Product.findOne({_id: productId[i]}, (err, foundProduct) => {
                        if(err){
                            console.log(err);
                        } else {
                            foundProduct.orderedUser.push({userId: req.decodedUser.id})
                            foundProduct.save()
                            .then(savedProduct => {
                                console.log(savedProduct);
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    })
                }
                newOrder.save((err, savedOrder) => (err) ? console.log(err) : console.log(savedOrder));
                foundUser.userCart = [];
                foundUser.save((err, savedOrder) => (err) ? console.log(err) : console.log(savedOrder))
                res.send(`Order Created: ${newOrder._id}`)
            }
        })
}