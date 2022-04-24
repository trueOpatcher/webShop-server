const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategory = new Schema({
    name: {
        type: String,
        required: true
    },

    items: [{
        imageUrl: {
            type: String, 
            required: true
        },
        name: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
    }],
})

