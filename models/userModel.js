const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    scanHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;