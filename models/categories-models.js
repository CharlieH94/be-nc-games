const db = require('../db/connection');
const { categoryData } = require('../db/data/test-data/index.js');

exports. fetchCategories = () => {
    return db.query(`SELECT * FROM categories`)
        .then(categoryData => {
            return categoryData.rows;
    })
}
