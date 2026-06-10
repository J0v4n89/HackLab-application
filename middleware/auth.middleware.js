exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.send('Not logged in');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.send('Forbidden');
    }
};
