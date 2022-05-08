const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favorSchema = new Schema({
    favID:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    doneBy:{
        type: String,
        required: true
    },
    doneFor:{
        type: String,
        required: true
    },
    value:{
        type: Number,
        required: true
    },
    datePosted:{
        type: Date,
        default: Date.now(),
        required: true
    },
    status:{
        type: Boolean,
        required: true
    }
})

const Favor = mongoose.model('Favor', favorSchema);

module.exports = Favor;