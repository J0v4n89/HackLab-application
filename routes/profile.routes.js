const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLoggedIn } = require('../middleware/auth.middleware');
const path = require('path');

router.get('/', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/profile.html'));
});

router.get('/view', isLoggedIn, (req, res) => {

    const userId = req.query.id;

    if (!userId) {
        return res.json({ error: 'Missing id' });
    }

    const query = "SELECT id, username, role, bio FROM users WHERE id = " + userId;

    db.query(query, (err, results) => {
        if (err) {
            return res.json({ error: 'DB error' });
        }

        return res.json({
            requested_id: userId,
            data: results
        });
    });
});

module.exports = router;
