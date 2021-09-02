const User = require("../models/user");
const Product = require("../models/products");
const Order = require("../models/order")
const bcrypt = require("bcrypt");
const { createAccessToken } = require('../auth');
const { updateProduct } = require("./productsControllers");

module.exports.registerUser = (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
        User.findOne({email: req.body.email}, (err,foundUser) => {
            if(foundUser){
                res.send(false);
            } else {
                let newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword
                });

                newUser.save()
                .then(registeredUser => {
                    res.send(true)
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
}

module.exports.loginUser = (req, res) => {
    User.findOne({email: req.body.email}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(req.body.password){
                    let passwordIsCorrect = bcrypt.compareSync(req.body.password, foundUser.password);
                    if(passwordIsCorrect){
                        res.send({accessToken: createAccessToken(foundUser)});
                    } else {
                        res.send(false);
                    }
                }
            } else {
                res.send(false);
            }
        }
    })
};

module.exports.userDetails = (req, res) => {
    User.findOne({_id: req.decodedUser.id}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            res.send(foundUser);
        }
    })
}

module.exports.updateUser = (req, res) => {
        let updates = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
        User.findByIdAndUpdate({_id: req.decodedUser.id}, {$set: updates}, { new:true }, (err, updatedUser) => {
            if(err){
                console.log(err);
            } else {
                res.send(updatedUser)
            }
        })
}

module.exports.changePassword = (req, res) => {
    User.findOne({_id: req.decodedUser.id}, (err, foundUser) => {
        if(foundUser){
            let passwordMatched = bcrypt.compareSync(req.body.currentPassword, foundUser.password);
            if(passwordMatched){
                if(req.body.newPassword === req.body.confirmPassword){
                    let newHashedPassword = bcrypt.hashSync(req.body.newPassword, 10); 
                    foundUser.password = newHashedPassword;
                    foundUser.save()
                    .then(result => {
                        res.send(`Password successfully updated!`)
                    })
                    .catch(err => {
                        console.log(err);
                    })
                } else {
                    res.send(`Password does not match!`)
                }
            } else {
                res.send(`Wrong password!`)
            }
        } else{
            res.send(`User not found!`)
        }
    })
};

module.exports.userCheckout = (req, res) => {
    User.findById({_id: req.decodedUser.id}, (err, foundUser) => {
        Product.findById({_id: req.body.productId}, (err, foundProduct) => {
            if(foundUser.userCart.length < 1){
                foundUser.userCart.push({productId: req.body.productId, productName: foundProduct.name, quantity: req.body.quantity , subtotal: req.body.subtotal })
                foundUser.save((err, savedUser) => err ? console.log(err) : res.send(foundUser)) 
            } else {
                (foundUser.userCart.quantity = req.body.quantity);
                foundUser.userCart.subtotal = req.body.subtotal;
                foundUser.save((err, savedUser) => err ? console.log(err) : res.send(foundUser.userCart));
            }
        })
    })
}

module.exports.checkCart = (req, res) => {
    User.findOne({_id: req.decodedUser.id}, (err, foundUser) =>{
        if(foundUser){
            res.send(foundUser.userCart);
        } else {
            console.log(err);
        }
    })
}

module.exports.makeAdmin = (req, res) => {
    if(req.body.id){
        User.findByIdAndUpdate({_id: req.body.id}, {$set:{isAdmin:true}}, {new:true}, (err, updatedAdminUser) => {
            if(err){
                console.log(err);
            } else {
                res.send(true)
            }
        })
    }
}

module.exports.deactivateUser = (req, res) => User.findByIdAndDelete({ _id: req.decodedUser.id}, (err, deletedUser) => (err) ? console.log(err) : res.send(true));
