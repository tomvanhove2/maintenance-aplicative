-- Script de création de la base de données
-- Mini Site Web - Base de données MySQL

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS mini_site_db;
USE mini_site_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion d'utilisateurs de test
-- ATTENTION: Mots de passe stockés en clair (mauvaise pratique volontaire!)
INSERT INTO users (username, password, email) VALUES 
('admin', 'admin123', 'admin@example.com'),
('user', 'user123', 'user@example.com'),
('test', 'test123', 'test@example.com');

-- Insertion de produits de démonstration
INSERT INTO products (name, description, price) VALUES 
('Ordinateur Portable', 'PC portable haute performance pour le gaming et le travail', 899.99),
('Souris Sans Fil', 'Souris ergonomique avec capteur optique précis', 29.99),
('Clavier Mécanique', 'Clavier gaming RGB avec switches mécaniques', 79.99),
('Écran 27 pouces', 'Moniteur Full HD IPS avec taux de rafraîchissement 144Hz', 299.99),
('Casque Audio', 'Casque bluetooth à réduction de bruit active', 159.99);

-- Affichage des données insérées
SELECT 'Utilisateurs créés:' as Info;
SELECT * FROM users;

SELECT 'Produits créés:' as Info;
SELECT * FROM products;
