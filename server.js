require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: 'supersecretkey',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth.routes');
const documentRoutes = require('./routes/document.routes');
const adminRoutes = require('./routes/admin.routes');
const searchRoutes = require('./routes/search.routes');
const profileRoutes = require('./routes/profile.routes');

app.use('/', authRoutes);
app.use('/documents', documentRoutes);
app.use('/admin', adminRoutes);
app.use('/search', searchRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/documents-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'documents.html'));
});


app.get('/admin-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
