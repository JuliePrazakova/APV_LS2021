const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
    try {
        const allPerson = await pool.query("SELECT nickname, first_name, last_name, birth_day, street_name FROM person INNER JOIN location ON person.id_location=location.id_location ORDER BY last_name, first_name");

        res.render('contacts', {
            title: 'Diář',
            users: allPerson.rows,
            search: 'Najdi kontakt'
        });
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
