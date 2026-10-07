const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Bhatt15031993!",
    database: "finance_management"
});

module.exports = db;