const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Writing MongoDB schemas/Rules

const eventSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    capacity: {
        type: Number,
        required: true
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref:'User'
    }

});   

module.exports = mongoose.model('Event', eventSchema);