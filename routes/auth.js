/**
 * Authentication routes
 * WARNING: Contains intentional SQL Injection vulnerabilities
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * GET /auth/register - Display registration form
 */
router.get('/register', (req, res) => {
    res.render('register', { error: null, success: null });
});

/**
 * POST /auth/register - Process registration
 */
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    // Data validation
    if (!username || username.trim().length < 3) {
        return res.render('register', { 
            error: 'Username must contain at least 3 characters', 
            success: null 
        });
    }
    if (!password || password.length < 6) {
        return res.render('register', { 
            error: 'Password must contain at least 6 characters', 
            success: null 
        });
    }
    
    try {
        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Use prepared statement to avoid SQL injection
        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        
        db.query(query, [username, hashedPassword, email || null], (err) => {
            if (err) {
                console.error('SQL Error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.render('register', { 
                        error: 'This username already exists', 
                        success: null 
                    });
                }
                return res.render('register', { 
                    error: 'Error creating account', 
                    success: null 
                });
            }
            
            // Account created successfully
            res.render('register', { 
                error: null, 
                success: 'Account created successfully! You can now log in.' 
            });
        });
    } catch (error) {
        console.error('Hashing error:', error);
        res.render('register', { 
            error: 'Error creating account', 
            success: null 
        });
    }
});

/**
 * GET /auth/login - Display login form
 */
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

/**
 * POST /auth/login - Process login
 * SECURITY VULNERABILITY #3: SQL Injection possible!
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // DANGER: SQL query vulnerable to SQL injection
    // An attacker can use: ' OR '1'='1
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    console.log('SQL Query:', query); // Log for demonstration
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.render('login', { error: 'Connection error' });
        }
        
        if (results.length > 0) {
            // Successful login
            req.session.user = results[0];
            res.redirect('/products');
        } else {
            res.render('login', { error: 'Incorrect credentials' });
        }
    });
});

/**
 * GET /auth/logout - Logout
 */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
