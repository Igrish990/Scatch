const mongoose = require('mongoose')
const { type } = require('os')
const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: String,
    password: String,
    products: {
        type: Array,
        default: []
    },

    contact: Number,
    gstin: String,

})
module.exports = mongoose.model('owner', ownerSchema)