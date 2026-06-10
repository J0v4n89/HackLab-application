const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLoggedIn } = require('../middleware/auth.middleware');

router.get('/', isLoggedIn, (req, res) => {
    const q = req.query.q || '';

    const query =
        "SELECT id, title FROM documents " +
        "WHERE title LIKE '%" + q + "%'";

    db.query(query, (err, results) => {
        if (err) return res.send('Error');

        res.json(results);
    });
});

module.exports = router;
