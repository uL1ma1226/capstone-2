const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: String,
    totalAmount: Number,
    purchasedOn: {
        type: Date,
        default: new Date()
    },
    order: []
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order