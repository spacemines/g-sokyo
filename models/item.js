const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    itemname: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    desciption: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['book', 'movies', 'music', 'unclassified'],
        default: 'unclassified'
    },
    picture: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Item', itemSchema)

