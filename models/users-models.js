const db = require("../db/connection");
const { userData } = require("../db/data/test-data/index.js");

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(userData => {
            return userData.rows;
    })
}