/**
 * Configuration de la connexion à la base de données MySQL
 * ATTENTION: Ce fichier contient des informations sensibles en dur (mauvaise pratique volontaire)
 */

const mysql = require('mysql2');

// FAILLE DE SÉCURITÉ #1: Identifiants en dur dans le code
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Utilisateur root - mauvaise pratique!
    password: 'Tomdu59173',        // Mot de passe en dur - très dangereux!
    database: 'mini_site_db'
});

/**
 * Établit la connexion à la base de données
 */
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

module.exports = connection;
