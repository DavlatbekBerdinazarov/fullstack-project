const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
    });
});

router.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products',
        product: true,
    });
});

router.get('/addproduct', (req, res) => {
    res.render('addproduct', {
        title: 'Add product',
        add: true,
    });
});

module.exports = router;