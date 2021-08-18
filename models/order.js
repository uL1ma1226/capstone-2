const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: String,
    quantity: Number,
    totalAmount: Number,
    purchasedOn: {
        type: Date,
        default: new Date()
    },
    order: [
        {
            productId: String,
            productName: String,
            orderedOn: {
                type: Date,
                default: new Date()
            }
        }
    ]
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order