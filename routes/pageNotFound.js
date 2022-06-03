const express = require('express');
const router = express.Router();

router.get('*', (req, res, next) => {
    res.render('pagenotfound', { title: 'Page not found' });
});

module.exports = router;