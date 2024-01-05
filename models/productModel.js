const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productName: {
        type: String,
    },
    productDescription: {
        type: String,
    },
    productImage: {
        type: String,
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    },
    quantity: {
        type: Number
    },
    productType: {
        type: String,
    },
    category: {
        type: String,
    },
    color: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;