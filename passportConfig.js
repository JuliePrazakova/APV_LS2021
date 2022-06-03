const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db');
const bcrypt = require('bcrypt');

function initialize(passport) {
    const auth = (username, password, done) => {

        pool.query(`SELECT * FROM registered_user WHERE username = $1`, [username], (err, results) => {
            if (err) throw err;
            if (results.rows.length > 0) {
                const user = results.rows[0];
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                });
            } else {
                return done(null, false, { message: 'Unknown username' });
            }
        });

    }

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, auth));
    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser((username, done) => {
        pool.query(`SELECT * FROM registered_user WHERE username = $1`, [username], (err, results) => {
            if (err) throw err;
            return done(null, results.rows[0]);
        });
    });
}

module.exports = initialize;