const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
    try {
        const allPerson = await pool.query("SELECT id_person, nickname, first_name, last_name, birth_day, street_name FROM person INNER JOIN location ON person.id_location=location.id_location ORDER BY last_name, first_name");

        res.render('contacts', {
            title: 'Diář',
            users: allPerson.rows,
            add: 'Přidej kontakt',
            add_url: 'contact',
            search: 'Najdi kontakt'
        });
    } catch (err) {
        console.error(err.message);
    }
});


router.get('/add_contact', (req, res, next) => {
    res.render('add-user', {
        title: 'Přidat kontakt',
        add: 'Přidej kontakt',
        add_url: 'contact'
    });
});
router.get('/contact/add_contact', async (req,res) => {
    res.redirect('/contact/add_contact');
})
router.get('/edituser/contact/add_contact', async (req,res) => {
    res.redirect('/contact/add_contact');
})
router.get('/view/contact/add_contact', async (req,res) => {
    res.redirect('/contact/add_contact');
})

router.post('/add_contact', async (req, res, next) => {
    pool.query(`INSERT INTO person (nickname, first_name, last_name, birth_day, height) 
		VALUES ($1, $2, $3, $4, $5)`, [req.body.nickname, req.body.first_name, req.body.last_name, req.body.dtb, req.body.height],
        (err, results) => {
            if (err) throw err;
            pool.query(`SELECT id_location FROM location WHERE city = $1 AND street_name = $2 AND street_number = $3 AND zip = $4`, [req.body.city, req.body.street_name, req.body.street_number, req.body.zip],
                (err, results) => {
                    if (err) throw err;
                    if(results.rows > 0){
                        pool.query(`UPDATE person SET id_location = $1`, [results.rows]);
                    }else{
                        pool.query(`INSERT INTO location (city, street_name, street_number, zip) VALUES ($1, $2, $3, $4)`, [req.body.city, req.body.street_name, req.body.street_number, req.body.zip]);
                        pool.query(`SELECT id_location FROM location WHERE city = $1 AND street_name = $2 AND street_number = $3 AND zip = $4`, [req.body.city, req.body.street_name, req.body.street_number, req.body.zip]);
                        pool.query(`UPDATE person SET id_location = $1`, [results.rows]);
                    }
                });
            pool.query(`INSERT INTO location (city, street_name, street_number, zip) VALUES ($1, $2, $3, $4) RETURNING id_location`,
                [req.body.city, req.body.street_name, req.body.street_number, req.body.zip],
                (err, results) => {
                    if (err) throw err;

                });
            res.redirect('/contact');
        });
});

router.post('/deleteuser/:id', async (req, res, next) => {
        pool.query(`DELETE FROM person WHERE id_person = $1`, [req.params.id], async (err, results) => {
            if (err) throw err;
            res.redirect('/contacts');
        });
});

router.get('/edituser/:id', async (req, res, next) => {
            const selected_user = await pool.query(`SELECT first_name, last_name, nickname, birth_day, height, gender, street_name, city, street_number, zip FROM person INNER JOIN location ON person.id_location=location.id_location WHERE id_person = $1`, [req.params.id]);
            res.render('edit-user', {
                title: 'Upravit',
                add: 'Přidej kontakt',
                add_url: 'contact',
                user: selected_user.rows
            });
});

router.get('/view/:id', async (req, res, next) => {
            const selected_user = await pool.query(`SELECT id_person, first_name, last_name, nickname, birth_day, height, gender, street_name FROM person INNER JOIN location ON person.id_location=location.id_location WHERE id_person = $1 `, [req.params.id]);
            res.render('view-user', {
                title: 'Náhled',
                add: 'Přidej kontakt',
                add_url: 'contact',
                user: selected_user.rows
            });
});

module.exports = router;
