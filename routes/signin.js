const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../db/index');
const passport = require('passport');

router.get('/', (req, res, next) => {
    res.render('signin', { title: 'Přihlášení' });
});

router.post('/', (req, res, next) => {
    res.render('contacts', { title: 'Přihlášení' });
});

module.exports = router;