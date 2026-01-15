/**
 * Routes d'authentification
 * ATTENTION: Contient des failles de sécurité SQL Injection volontaires
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /auth/register - Affiche le formulaire d'inscription
 */
router.get('/register', (req, res) => {
    res.render('register', { error: null, success: null });
});

/**
 * POST /auth/register - Traite l'inscription
 * FAILLE DE SÉCURITÉ #6: Pas de validation des données, injection SQL possible
 */
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    
    // DANGER: Pas de validation des données
    // DANGER: Mot de passe stocké en clair (pas de hash)
    // DANGER: Injection SQL possible avec la concaténation
    const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
    
    console.log('Requête SQL:', query); // Log pour démonstration
    
    db.query(query, (err) => {
        if (err) {
            console.error('Erreur SQL:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.render('register', { 
                    error: 'Ce nom d\'utilisateur existe déjà', 
                    success: null 
                });
            }
            return res.render('register', { 
                error: 'Erreur lors de la création du compte', 
                success: null 
            });
        }
        
        // Compte créé avec succès
        res.render('register', { 
            error: null, 
            success: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' 
        });
    });
});

/**
 * GET /auth/login - Affiche le formulaire de connexion
 */
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

/**
 * POST /auth/login - Traite la connexion
 * FAILLE DE SÉCURITÉ #3: Injection SQL possible!
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // DANGER: Requête SQL vulnérable à l'injection SQL
    // Un attaquant peut utiliser: ' OR '1'='1
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    console.log('Requête SQL:', query); // Log pour démonstration
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.render('login', { error: 'Erreur de connexion' });
        }
        
        if (results.length > 0) {
            // Connexion réussie
            req.session.user = results[0];
            res.redirect('/products');
        } else {
            res.render('login', { error: 'Identifiants incorrects' });
        }
    });
});

/**
 * GET /auth/logout - Déconnexion
 */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
