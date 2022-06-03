const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.get('/', (req, res, next) => {
    res.render('register', { title: 'Registration' });
});

router.post('/', async (req, res, next) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    pool.query(`SELECT * FROM registered_user WHERE username = $1`, [req.body.username], (err, results) => {
        if (err) throw err;

        if (results.rows.length > 0) {
            res.render('register', { title: 'Registration', message: 'Username already taken.' });
        } else {
            pool.query(`INSERT INTO registered_user (username, email, password) 
				VALUES ($1, $2, $3) RETURNING password`, [req.body.username, req.body.emailAddress, hashedPassword],
                (err, results) => {
                    if (err) throw err;
                    res.redirect('signin');
                });
        }

    });

});

module.exports = router;