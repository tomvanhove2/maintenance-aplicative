/**
 * Routes pour la page d'accueil
 */

const express = require('express');
const router = express.Router();

/**
 * GET / - Page d'accueil
 * Affiche la page d'accueil avec le statut de connexion
 */
router.get('/', (req, res) => {
    res.render('index', { 
        user: req.session.user || null 
    });
});

module.exports = router;
