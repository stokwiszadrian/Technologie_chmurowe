
require('dotenv').config();
const { Client } = require('pg');


const dbConnData = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER ,
    password: process.env.PGPASSWORD
};

module.exports = new Client(dbConnData);


