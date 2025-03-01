const express = require('express')
const router = express.Router()
const upload = require('../config/multer-config')
const productModel = require('../models/product-model')

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {

            return res.status(400).send('No file uploaded')
        }

        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        })
        req.flash('success', 'Product Created')
        res.redirect('/owners/products')
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router;