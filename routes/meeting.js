const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async(req, res) => {
    try {
        const allPerson = await pool.query("SELECT  extract(minute from start), description, city , id_meeting FROM meeting INNER JOIN location ON meeting.id_location=location.id_location ORDER BY location");

        res.render('meetings', {
            title: 'Diář',
            users: allPerson.rows,
            add: 'Přidej schůzku',
            add_url: 'meeting',
            search: 'Najdi meeting podle místa'
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/add_meeting', (req, res, next) => {
    res.render('add-meeting', {
        title: 'Přidat schůzku',
        add: 'Přidej schůzku',
        add_url: 'meeting'
    });
});
router.get('/meeting/add_meeting', async (req,res) => {
    res.redirect('/meeting/add_meeting');
})
router.get('/view/meeting/add_meeting', async (req,res) => {
    res.redirect('/meeting/add_meeting');
})

router.get('/editmeeting/meeting/add_meeting', async (req,res) => {
    res.redirect('/meeting/add_meeting');
})

router.post('/add_meeting', async (req, res, next) => {

    pool.query(`INSERT INTO location (city, street_name, street_number, zip) VALUES ($1, $2, $3, $4) RETURNING id_location`,
        [req.body.city, req.body.street_name, req.body.street_number, req.body.zip],
        (err, results) => {
            if (err) throw err;

            let id = results.rows;

            pool.query(`INSERT INTO meeting (start, description, duration, id_location) VALUES ($1, $2, $3, $4)`, [req.body.start, req.body.desc, req.body.duration, id[0].id_location],
                (err, results) => {
                    if (err) throw err;
                    res.redirect('/meeting');
                });
        });
});


router.get('/deletemeeting/:id', async (req, res, next) => {

    pool.query(`DELETE FROM meeting WHERE id_meeting = $1`, [req.params.id], async (err, results) => {
        if (err) throw err;
        res.redirect('/meetings');
    });
});

router.get('/view/:id', async (req, res) => {
    const selected_meeting = await pool.query(`SELECT id_meeting,start,  description, duration, city, street_name, street_number, zip FROM meeting INNER JOIN location ON meeting.id_location=location.id_location WHERE id_meeting = $1`, [req.params.id]);
    res.render('view-meeting', {
        title: 'Náhled',
        add: 'Přidej schůzku',
        add_url: 'meeting',
        meeting: selected_meeting.rows
    });
});

router.get('/editmeeting/:id', async (req, res) => {
    const selected_meeting = await pool.query(`SELECT id_meeting, start,  description, duration, city, street_name, street_number, zip FROM meeting INNER JOIN location ON meeting.id_location=location.id_location WHERE id_meeting = $1`, [req.params.id]);
    res.render('edit-meeting', {
        title: 'Upravit schůzku',
        add: 'Přidej schůzku',
        add_url: 'meeting',
        meeting: selected_meeting.rows
    });
});
router.post('/editmeeting/:id', async (req,res) => {
    pool.query(`UPDATE meeting SET start =$1, duration = $2, description = $3 WHERE id_meeting = $4`, [req.body.start, req.body.duration, req.body.desc, req.params.id]);
    const id_location = pool.query(`SELECT id_location
                                    FROM location
                                    WHERE city = $1
                                      AND street_name = $2
                                      AND street_number = $3`, [req.body.city, req.body.name, req.body.street_number], (err, results) => {

        if (id_location > 0) {
            pool.query(`UPDATE meeting
                        SET id_location = $1`, [id_location]);

        } else {
            pool.query(`INSERT INTO location (city, street_name, street_number, zip)
                        VALUES ($1, $2, $3, $4)`, [req.body.city, req.body.street_name, req.body.street_number, req.body.zip],
                (err, results) => {
                    if (err) throw err;
                });
            const id_new_location = pool.query(`SELECT id_location FROM location 
                                               WHERE city = $1
                                                 AND street_name = $2
                                                 AND street_number = $3`, [req.body.city, req.body.name, req.body.street_number]);
            pool.query(`UPDATE meeting SET id_meeting = $1`, [id_new_location]);
        }
        res.redirect('/meeting');
    });
});

module.exports = router;

