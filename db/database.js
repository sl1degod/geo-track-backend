const Pool = require('pg').Pool;
const pool = new Pool({
    user:"postgres",
    password: 'ilyas2701',
    host: "localhost",
    port: 5432,
    database: "kursovaya"
});

module.exports = pool;