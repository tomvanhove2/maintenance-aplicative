# 🛒 Mini Site Web - Node.js/Express/MySQL

Mini site web de démonstration développé avec Node.js, Express et MySQL. Ce projet contient **volontairement** des failles de sécurité et un bug à des fins pédagogiques.

## ⚠️ AVERTISSEMENT DE SÉCURITÉ

**Ce site contient des vulnérabilités intentionnelles et ne doit JAMAIS être déployé en production!**

Il est conçu uniquement à des fins éducatives pour démontrer :
- Les conséquences des mauvaises pratiques de sécurité
- L'importance de la validation des données
- Les risques liés aux injections SQL
- Les problèmes de gestion de sessions

## 📋 Fonctionnalités

- ✅ **Page d'accueil** - Interface de bienvenue
- ✅ **Page de connexion** - Système d'authentification
- ✅ **Gestion de produits** - CRUD complet (Create, Read, Update, Delete)
- ✅ **Interface responsive** - Design moderne et adaptatif

## 🛠️ Technologies Utilisées

- **Backend**: Node.js v16+
- **Framework**: Express.js
- **Base de données**: MySQL 8.0
- **Template Engine**: EJS
- **Session Management**: express-session
- **Parsing**: body-parser

## 📦 Installation

### Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner ou télécharger le projet**
   ```bash
   cd maintenance_applicative
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Copier le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
   
   Puis éditer le fichier `.env` et modifier les valeurs :
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe_mysql
   DB_NAME=mini_site_db
   ```

4. **Configurer la base de données**
   
   a. Démarrer MySQL
   
   b. Importer le script SQL :
   ```bash
   mysql -u root -p < database/init.sql
   ```
   
   Ou via MySQL Workbench / phpMyAdmin, exécuter le contenu du fichier `database/init.sql`

5. **Lancer le serveur**
   ```bash
   npm start
   ```
   
   Ou en mode développement (avec nodemon) :
   ```bash
   npm run dev
   ```

6. **Accéder au site**
   
   Ouvrir un navigateur et aller sur : `http://localhost:3000`

## 👤 Comptes de Test

**Note** : Les mots de passe sont maintenant hashés avec bcrypt pour plus de sécurité.

| Nom d'utilisateur | Mot de passe |
|-------------------|--------------|
| admin             | admin123     |
| user              | user123      |
| test              | test123      |

💡 **Vous pouvez aussi créer votre propre compte** via la page d'inscription `/auth/register`

## 🐛 Failles de Sécurité Volontaires

### 1. **Injection SQL** 
- **Localisation**: `routes/auth.js` - Ligne 22
- **Description**: Les identifiants de connexion ne sont pas échappés
- **Test**: Utiliser `' OR '1'='1` comme nom d'utilisateur
- **Impact**: Permet de se connecter sans connaître les identifiants

## 🪲 Bug Volontaire

### Bug de conversion de type
- **Localisation**: `routes/products.js` - Ligne 49
- **Description**: Le prix n'est pas converti en nombre lors de la mise à jour
- **Impact**: Le prix reste une chaîne de caractères, ce qui peut causer des problèmes lors de calculs ultérieurs (tri, comparaisons, opérations mathématiques)
- **Test**: 
  1. Ajouter un produit avec un prix de 100
  2. Le modifier avec un prix de 50
  3. Essayer de comparer ou trier les prix

**Comment le corriger** :
```javascript
// Ligne 49 - Remplacer par :
const numericPrice = parseFloat(price);
const query = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';
db.query(query, [name, description, numericPrice, id], (err) => {
```

## 📁 Structure du Projet

```
maintenance_applicative/
│
├── config/
│   └── database.js          # Configuration de la connexion MySQL
│
├── routes/
│   ├── home.js              # Routes pour la page d'accueil
│   ├── auth.js              # Routes d'authentification (LOGIN/LOGOUT)
│   └── products.js          # Routes CRUD pour les produits
│
├── views/
│   ├── index.ejs            # Page d'accueil
│   ├── login.ejs            # Page de connexion
│   ├── products.ejs         # Liste des produits avec formulaires
│   └── product-detail.ejs   # Détail d'un produit
│
├── public/
│   └── style.css            # Feuille de styles CSS
│
├── database/
│   └── init.sql             # Script de création de la BDD
│
├── server.js                # Point d'entrée de l'application
├── package.json             # Dépendances et scripts npm
└── README.md                # Ce fichier
```

## 🔧 Routes Disponibles

| Méthode | Route                | Description                     |
|---------|----------------------|---------------------------------|
| GET     | /                    | Page d'accueil                  |
| GET     | /auth/login          | Affiche le formulaire de connexion |
| POST    | /auth/login          | Traite la connexion             |
| GET     | /auth/logout         | Déconnexion                     |
| GET     | /products            | Liste des produits (requis auth)|
| POST    | /products/add        | Ajoute un produit               |
| POST    | /products/update/:id | Modifie un produit              |
| POST    | /products/delete/:id | Supprime un produit             |
| GET     | /products/:id        | Détail d'un produit             |

## 📝 Commentaires dans le Code

Tous les fichiers sont documentés avec des commentaires expliquant :
- Le rôle de chaque fonction
- Les paramètres et valeurs de retour
- Les failles de sécurité présentes
- Le bug volontaire

## 🎯 Objectifs Pédagogiques

Ce projet démontre :

1. **Architecture MVC simple** avec Express.js
2. **Intégration MySQL** avec Node.js
3. **Système de templates** avec EJS
4. **Gestion de sessions** avec express-session
5. **CRUD complet** pour une entité (produits)
6. **Conséquences de mauvaises pratiques de sécurité**
7. **Impact des bugs de conversion de type**

## 🔒 Comment Sécuriser Ce Site

Pour transformer ce site en une application sécurisée :

1. **Utiliser des requêtes préparées** partout
2. **Hasher les mots de passe** avec bcrypt
3. **Déplacer les credentials** dans des variables d'environnement (.env)
4. **Utiliser un secret fort** pour les sessions
5. **Activer HTTPS** et les cookies sécurisés
6. **Valider toutes les entrées** utilisateur
7. **Implémenter un système de rôles** (RBAC)
8. **Ajouter des logs de sécurité**
9. **Corriger le bug** de conversion de prix

## 📄 Licence

Ce projet est à des fins éducatives uniquement.

## 👨‍💻 Auteur

Projet de démonstration - 2026

---

**Rappel**: Ce code contient des vulnérabilités intentionnelles. Ne jamais utiliser en production!
