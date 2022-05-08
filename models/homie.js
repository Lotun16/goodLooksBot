const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homieSchema = new Schema({
    homieID:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    favorsOwed: [{
        type: String,
        required: true
    }],
    favorsDone: [{
        type: String,
        required: true
    }],
    bucks:{
        type: Number,
        required: true
    },
})

const Homie = mongoose.model('Homie', homieSchema);

module.exports = Homie;