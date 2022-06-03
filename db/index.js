const Pool = require("pg").Pool;

const pool = new Pool({
        host: 'localhost',
        user: 'xprazak6',
        password: 'pwxprazak6',
        database: 'xprazak6',
        port: '5432'
    }
);

pool.connect();

module.exports = pool;