const express = require('express')
const router = express.Router()
const ownerModel = require('../models/owners-model')
const isLoggedin = require('../middlewares/isLoggedin')
const productModel = require('../models/product-model')
if (process.env.NODE_ENV === 'development') {
    router.post('/create', async (req, res) => {
        let owners = await ownerModel.find()
        if (owners.length > 0) { return res.status(503).send("You don't have permission to create a new owner") }
        let { fullname, email, password } = req.body
        let createdOwner = await ownerModel.create({
            fullname, email, password,
        })
        res.status(201).send(createdOwner)
    })


}

router.get('/products', isLoggedin, async (req, res) => {
    let products = await productModel.find()
    let success = req.flash('success')
    let error = req.flash('error')
    res.render('admin-products', { products, success, error })
})

router.get('/products/create', isLoggedin, (req, res) => {
    let success = req.flash('success')
    let error = req.flash('error')
    res.render('createproducts', { success, error })
})




router.get('/products/edit/:id', isLoggedin, async (req, res) => {
    let product = await productModel.findById(req.params.id)
    let success = req.flash('success')
    let error = req.flash('error')
    res.render('edit-product', { product, success, error })
})

router.post('/products/edit/:id', isLoggedin, async (req, res) => {
    let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body
    await productModel.findByIdAndUpdate(req.params.id, {
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    })
    req.flash('success', 'Product updated successfully')
    res.redirect('/owners/products')
})

router.post('/products/delete/:id', isLoggedin, async (req, res) => {
    await productModel.findByIdAndDelete(req.params.id)
    req.flash('error', 'Product deleted ')
    res.redirect('/owners/products')
})
router.get('/products/deleteAll', isLoggedin, async (req, res) => {
    await productModel.deleteMany()
    req.flash('error', 'All products deleted ')
    res.redirect('/owners/products')
})
module.exports = router;