const { Schema, model } = require("mongoose");

const Settings = new Schema({
    id: Number,
    currencyName: String,
    gifs: {
        kissGifs: Array,
        eatGifs: Array,
        cryGifs: Array,
        hitGifs: Array,
        hugGifs: Array,
        killGifs: Array,
        smokeGifs: Array,
        danceGifs: Array,
        handGifs: Array,
        analGifs: Array,
        suckGifs: Array,
        cumGifs: Array,
        sexGifs: Array,
        otlizGifs: Array
    }
});

module.exports = model("Settings", Settings, "Settings");