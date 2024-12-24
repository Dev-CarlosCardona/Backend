require('dotenv').config();

const Kafeteriadb = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
};

module.exports = { Kafeteriadb };