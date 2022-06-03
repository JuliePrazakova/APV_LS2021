const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
    try {
        const allPerson= await pool.query("SELECT * FROM person");

        res.json(allPerson.rows);
    } catch (err) {
        console.error(err.message);
    }
    res.render('main', { title: 'Diář', persons: true });
});

/*
app.get('/contacts:id', async (req,res) => {
        const { id } = req.params;
        try{
        const todo=
        }catch{
        }
})

 */

module.exports = router;
