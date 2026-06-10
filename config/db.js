const mysql = require('mysql2');

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root123',
	database: 'zrs_projekat'
});

db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('MySQL connected');
});

module.exports = db;
