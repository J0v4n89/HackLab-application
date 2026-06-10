const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

const db = require('../config/db');
const { isLoggedIn } = require('../middleware/auth.middleware');

router.get('/', isLoggedIn, (req, res) => {
    res.sendFile('documents.html', { root: './views' });
});

router.post('/create', isLoggedIn, (req, res) => {
    const { title, content, file_path } = req.body;

    const query = `
        INSERT INTO documents (user_id, title, content, file_path)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [req.session.user.id, title, content, file_path], (err) => {
        if (err) return res.send('Error creating document');

        res.redirect('/documents');
    });
});

router.get('/my', isLoggedIn, (req, res) => {
    const userId = req.query.id;

    if (!userId) {
        return res.json({ error: 'Missing id' });
    }

    const query = `
        SELECT * FROM documents
        WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.send('Error');

        res.json(results);
    });
});

router.get('/view/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM documents WHERE id = ?", [id], (err, result) => {
        if (err) return res.json({ error: 'Error' });

        if (result.length === 0) {
            return res.json({ error: 'Not found' });
        }

        res.json(result[0]);
    });
});

router.get('/file/view/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;

    db.query("SELECT file_path FROM documents WHERE id = ?", [id], (err, result) => {
        if (err || result.length === 0) {
            return res.send('Error');
        }

        const filePath = result[0].file_path;

        exec("cat " + filePath, (err, stdout, stderr) => {
            if (err) {
                return res.send(`
                    <h2>Command Error</h2>
                    <pre>${stderr}</pre>
                    <br>
                    <a href="/documents">Back</a>
                `);
            }

            res.send(`
                <h2>File Output</h2>
                <pre>${stdout}</pre>
                <br>
                <a href="/documents">Back</a>
            `);
        });
    });
});

router.post('/delete/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;

    const query = `
        DELETE FROM documents
        WHERE id = ?
    `;

    db.query(query, [id], (err) => {
        if (err) return res.send('Error deleting document');

        res.redirect('/documents');
    });
});

router.get('/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT * FROM documents
        WHERE id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) return res.send('Error');

        res.json(results);
    });
});

module.exports = router;
