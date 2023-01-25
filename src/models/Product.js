const { Schema, model } = require("mongoose");

const Product = new Schema({
    _id: Schema.Types.ObjectId,
    price: { type: Number, default: 0},
    content: {
        name: String,
        description: String,
        product: String
    }
});

module.exports = model("Product", Product, "Product");