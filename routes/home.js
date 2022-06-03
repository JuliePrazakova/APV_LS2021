const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
        res.render('signin', {
            title: 'Diář'
        });

});

module.exports = router;
