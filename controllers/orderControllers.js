const User = require("../models/user");
const Product = require("../models/products");
const Order = require("../models/order");

//user
module.exports.userOrder = (req, res) => {
    User.findById({_id: req.decodedUser.id}, (err, foundUser)=> {
        if(foundUser){
            Order.find({userId: foundUser._id}, (err, foundOrder) => {
                let allOrderId = []
                let products = []
                foundOrder.forEach(user => {
                    allOrderId.push(user)
                })
                res.send(allOrderId)
            })
            
        } else {
            console.log(err)
            res.send(false);
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

            let newOrder = new Order({
                userId: req.decodedUser.id,
                totalAmount: req.body.totalAmount,
                order: req.body.order
            })
            newOrder.save((err, savedOrder) => {
                if(err) {
                    console.log(err)
                } else{
                    foundUser.orders.push(savedOrder._id)
                    foundUser.userCart = []
                    foundUser.save((err, savedUser) => err ? console.log(err) : res.send(true));

                } 
            });

        })
    }