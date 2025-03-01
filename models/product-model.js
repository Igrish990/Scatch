const { name } = require('ejs')
const mongoose = require('mongoose')
const { type } = require('os')

const productSchema = mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,

})
module.exports = mongoose.model('product', productSchema)