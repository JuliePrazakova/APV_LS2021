const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async(req, res) => {
    try {
        const allPerson = await pool.query("SELECT  extract(minute from start), description, city FROM meeting INNER JOIN location ON meeting.id_location=location.id_location ORDER BY location");

        res.render('meetings', {
            title: 'Diář',
            users: allPerson.rows,
            search: 'Najdi meeting podle místa'
        });
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;