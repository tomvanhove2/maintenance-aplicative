/**
 * Main Express Server
 * Mini website with intentional vulnerabilities for demonstration
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Template engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Secure session configuration
app.use(session({
    secret: 'un-secret-tres-long-et-complexe-pour-la-production-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,    // In production, set to true with HTTPS
        httpOnly: true,   // Cookie not accessible via JavaScript (XSS protection)
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const homeRoutes = require('./routes/home');

// Use routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    console.log('⚠️  WARNING: This site contains intentional security vulnerabilities!');
});
