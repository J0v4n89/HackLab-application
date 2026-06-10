const express = require('express');
const router = express.Router();
const path = require('path');

const auth = require('../controllers/auth.controller');

router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    return res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './views' });
});

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './views' });
});


router.get('/change-password', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Change Password</title>

            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #0f172a;
                    color: white;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }

                .container {
                    width: 400px;
                    background: #111827;
                    padding: 40px;
                    border-radius: 14px;
                    text-align: center;
                }

                h2 {
                    margin-bottom: 30px;
                }

                input {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    background: #1f2937;
                    color: white;
                    margin-bottom: 20px;
                    box-sizing: border-box;
                }

                button {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    background: #22c55e;
                    color: white;
                    cursor: pointer;
                    font-size: 15px;
                }

                button:hover {
                    background: #16a34a;
                }

                a {
                    display: inline-block;
                    margin-top: 20px;
                    color: #60a5fa;
                    text-decoration: none;
                }

                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>

        <body>

            <div class="container">

                <h2>Change Password</h2>

                <form method="POST" action="/change-password">

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New password"
                        required
                    >

                    <button type="submit">
                        Change Password
                    </button>

                </form>

                <a href="/dashboard">
                    Back
                </a>

            </div>

        </body>
        </html>
    `);
});

router.post('/change-password', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { newPassword } = req.body;

    const query = "UPDATE users SET password = ? WHERE id = ?";

    const db = require('../config/db');

    db.query(query, [newPassword, req.session.user.id], (err) => {
        if (err) {
            return res.send('Password change error');
        }

        res.send('Password changed');
    });
});


router.get('/auth/me', auth.me);

router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/logout', auth.logout);

module.exports = router;
