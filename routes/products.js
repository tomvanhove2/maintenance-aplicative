/**
 * Routes pour la gestion des produits (CRUD)
 * ATTENTION: Contient un bug volontaire dans la fonction de mise à jour
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Middleware pour vérifier si l'utilisateur est connecté
 */
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

/**
 * GET /products - Affiche la liste des produits
 */
router.get('/', requireAuth, (req, res) => {
    db.query('SELECT * FROM products ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.render('products', { 
            products: results,
            user: req.session.user 
        });
    });
});

/**
 * POST /products/add - Ajoute un nouveau produit
 */
router.post('/add', requireAuth, (req, res) => {
    const { name, description, price } = req.body;
    
    // FAILLE DE SÉCURITÉ #4: Pas de validation des données
    const query = 'INSERT INTO products (name, description, price) VALUES (?, ?, ?)';
    
    db.query(query, [name, description, price], (err) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).send('Erreur lors de l\'ajout');
        }
        res.redirect('/products');
    });
});

/**
 * POST /products/update/:id - Met à jour un produit
 * BUG VOLONTAIRE: Le prix n'est pas correctement converti en nombre
 */
router.post('/update/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    // BUG: Le prix devrait être converti en nombre, mais il reste une chaîne
    // Cela peut causer des problèmes de calcul plus tard
    const query = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';
    
    db.query(query, [name, description, price, id], (err) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).send('Erreur lors de la mise à jour');
        }
        res.redirect('/products');
    });
});

/**
 * POST /products/delete/:id - Supprime un produit
 */
router.post('/delete/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    
    // FAILLE DE SÉCURITÉ #5: Pas de vérification des permissions
    // N'importe quel utilisateur connecté peut supprimer n'importe quel produit
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).send('Erreur lors de la suppression');
        }
        res.redirect('/products');
    });
});

/**
 * GET /products/:id - Affiche les détails d'un produit
 */
router.get('/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur:', err);
            return res.status(500).send('Erreur serveur');
        }
        
        if (results.length === 0) {
            return res.status(404).send('Produit non trouvé');
        }
        
        res.render('product-detail', { 
            product: results[0],
            user: req.session.user 
        });
    });
});

module.exports = router;
