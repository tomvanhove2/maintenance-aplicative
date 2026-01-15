/**
 * Serveur Express principal
 * Mini site web avec vulnérabilités volontaires pour démonstration
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuration du moteur de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// FAILLE DE SÉCURITÉ #2: Configuration de session non sécurisée
app.use(session({
    secret: 'secret123',  // Secret faible et en dur
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,    // Pas de HTTPS requis
        httpOnly: false   // Cookie accessible par JavaScript
    }
}));

// Import des routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const homeRoutes = require('./routes/home');

// Utilisation des routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log('⚠️  ATTENTION: Ce site contient des failles de sécurité volontaires!');
});
