const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    orderedUser: [
        {
            userId: String,
            orderedOn: {
                type: Date,
                default: new Date()
            }
        }
    ]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;