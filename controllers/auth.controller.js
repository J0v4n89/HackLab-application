const db = require('../config/db');

exports.register = (req, res) => {
    const { username, password } = req.body;

    const query =
        "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(query, [username, password], (err) => {

        if (err) {
            return res.send('Register error');
        }

        res.redirect('/login');

    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    const query =
        "SELECT * FROM users WHERE username = '" +
        username +
        "' AND password = '" +
        password +
        "'";

    db.query(query, (err, result) => {

        if (err) {
            return res.send('Login error');
        }

        if (result.length > 0) {

            req.session.user = {
                id: result[0].id,
                username: result[0].username,
                role: result[0].role
            };

            return res.redirect('/dashboard');
        }

        res.send('Login failed');

    });
};

exports.logout = (req, res) => {

    req.session.destroy(() => {
        res.redirect('/login');
    });

};

exports.me = (req, res) => {

    if (!req.session.user) {
        return res.json({});
    }

    res.json({
        id: req.session.user.id,
        username: req.session.user.username,
        role: req.session.user.role
    });

};
