const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
    res.render('logout', {
        title: 'Odhlášení'
    });

});

module.exports = router;