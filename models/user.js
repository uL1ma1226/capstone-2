const mongoose = require('mongoose');
const Product = require('./products');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String, 
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    userCart:[
        {
            productId: String,
            productName: String,
            quantity: Number,
            subtotal: Number,
            addedOn: {
                type: Date,
                default: new Date()
            },
            status: {
                type: String,
                default: "Added to Cart"
            }
        }
    ],
    orders: []
})

const User = mongoose.model('User', userSchema);
module.exports = User;