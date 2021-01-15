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
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['book', 'movies', 'music', 'object', 'misc'],
        default: 'misc'
    },
    picture: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Item', itemSchema)

