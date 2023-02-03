const { Schema, model } = require("mongoose");

const User = new Schema({
    userId: String,
    currency: { type: Number, default: 0 },
    purchasedHistory: Array,
    repAmount: { type: Number, default: 0 },
    antirepAmount: { type: Number, default: 0 },
    earnCooldown: { type: Date},
    repCooldown: { type: Date },
    antirepCooldown: { type: Date },
});

module.exports = model("User", User, "User");
