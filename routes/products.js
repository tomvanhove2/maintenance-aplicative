/**
 * Product management routes (CRUD)
 * WARNING: Contains an intentional bug in the update function
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Middleware to check if user is logged in
 */
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

/**
 * GET /products - Display product list
 */
router.get('/', requireAuth, (req, res) => {
    db.query('SELECT * FROM products ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Server error');
        }
        res.render('products', { 
            products: results,
            user: req.session.user 
        });
    });
});

/**
 * POST /products/add - Add a new product
 */
router.post('/add', requireAuth, (req, res) => {
    const { name, description, price } = req.body;
    
    // Data validation
    if (!name || name.trim().length === 0) {
        return res.status(400).send('Product name is required');
    }
    if (!description || description.trim().length === 0) {
        return res.status(400).send('Description is required');
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return res.status(400).send('Price must be a positive number');
    }
    
    const query = 'INSERT INTO products (name, description, price) VALUES (?, ?, ?)';
    
    db.query(query, [name.trim(), description.trim(), parseFloat(price)], (err) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Error adding product');
        }
        res.redirect('/products');
    });
});

/**
 * POST /products/update/:id - Update a product
 * INTENTIONAL BUG: Price is not properly converted to a number
 */
router.post('/update/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    // Data validation
    if (!name || name.trim().length === 0) {
        return res.status(400).send('Product name is required');
    }
    if (!description || description.trim().length === 0) {
        return res.status(400).send('Description is required');
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return res.status(400).send('Price must be a positive number');
    }
    
    // BUG: Price should be converted to a number, but it remains a string
    // This can cause calculation problems later
    const query = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';
    
    db.query(query, [name.trim(), description.trim(), price, id], (err) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Error updating product');
        }
        res.redirect('/products');
    });
});

/**
 * POST /products/delete/:id - Delete a product
 */
router.post('/delete/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    
    // All logged-in users can delete products (intended behavior)
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/products');
    });
});

/**
 * GET /products/:id - Display product details
 */
router.get('/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Server error');
        }
        
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        
        res.render('product-detail', { 
            product: results[0],
            user: req.session.user 
        });
    });
});

module.exports = router;
