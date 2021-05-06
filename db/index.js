const Pool = require("pg").Pool;

const pool = new Pool({
        host: 'localhost',
        user: 'xprazak6',
        password: 'pwxprazak6',
        database: 'xprazak6',
        port: '5432'
    }
);

//client.connect();

module.exports = pool;