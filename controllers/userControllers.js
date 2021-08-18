const User = require("../models/user");
const Product = require("../models/products");
const Order = require("../models/order")
const bcrypt = require("bcrypt");
const { createAccessToken } = require('../auth');

module.exports.registerUser = (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    if(req.body.email && req.body.firstName && req.body.lastName && req.body.password && req.body.confirmPassword && req.body.address) {
        if(req.body.password === req.body.confirmPassword){
            User.findOne({email: req.body.email}, (err,foundUser) => {
                if(foundUser){
                    res.send(`${req.body.email} already exists!`);
                } else {
                    let newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        address: req.body.address,
                        email: req.body.email,
                        password: hashedPassword
                    });

                    newUser.save()
                    .then(registeredUser => {
                        res.send(`Successfully Registered! Welcome to our store, ${req.body.firstName}!`)
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
        } else{
            res.send(`Password does not match!`);
        }
    } else {
        res.send(`All fields are required!`);
    }
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
                        res.send("Credentials are incorrect!");
                    }
                }
            } else {
                res.send(`${req.body.email} does not exist!`);
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
    if(req.body.firstName && req.body.lastName){
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
    } else {
        res.send(`All fields are required!`);
    }
}

module.exports.updateUserAddress = (req, res) => {
    if(req.body.address){
        User.findByIdAndUpdate({_id: req.decodedUser.id}, {$set:{address: req.body.address}}, {new:true}, (err, updatedAddress)=>{
            if(err){
                console.log(err);
            }else{
                res.send(updatedAddress)
            }
        })
    }else{
        res.send(`All fields are required!`);
    }
};

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
    if(req.body.productId){
        Product.findById({_id: req.body.productId}, (err, foundProduct) => {
            if(foundProduct && foundProduct.isActive){
                User.findOne({_id: req.decodedUser.id})
                .then(foundUser => {
                    let cart = foundUser.userCart.findIndex(cart => cart.productId == req.body.productId);
                    console.log(cart);
                    if(cart == -1){
                        foundUser.userCart.push({productId: req.body.productId, productName: foundProduct.name, quantity: Math.abs(cart), subtotal: foundProduct.price})
                        foundUser.save()
                        .then(result => {
                            console.log(result);
                            res.send(`${foundProduct.name} added to cart`)
                        }).catch(err => {
                            console.log(err);
                        })
                    } else {
                        foundUser.userCart[cart].quantity += 1;
                        foundUser.userCart[cart].subtotal = foundProduct.price * foundUser.userCart[cart].quantity;
                        foundUser.save()
                        .then(result => {
                            console.log(result);
                            res.send(`Another ${foundProduct.name} added to cart`)
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                    // res.send(`Added to Cart!`)
                })
            } else {
                res.send(`Sorry, product is not available.`);
            }
        })
    } else {
        res.send(`All fields required!`)
    }
}

module.exports.checkCart = (req, res) => {
    User.findOne({_id: req.decodedUser.id}, (err, foundUser) =>{
        if(foundUser){
            res.send(foundUser);
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
                res.send(`${updatedAdminUser.name} is now an admin`)
            }
        })
    }
}

module.exports.deactivateUser = (req, res) => User.findByIdAndDelete({ _id: req.decodedUser.id}, (err, deletedUser) => (err) ? console.log(err) : res.send(`User with the following details has been deleted: ${deletedUser}`));
