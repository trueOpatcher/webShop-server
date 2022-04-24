const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: {
        type: String,
        required: true
    },

    items: [{
        imageUrl: String,
        name: String,
        desc: String,
        price: String,
    }],

    subCategory: [{
        name: String,
        items: [{
            imageUrl: String,
            name: String,
            desc: String,
            price: String,
        }]
    }]
})

module.exports = mongoose.model('categories', Category);