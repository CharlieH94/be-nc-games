const db = require('../db/connection');
const { categoryData } = require('../db/data/test-data/index.js');

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories`)
        .then(categoryData => {
            return categoryData.rows;
    })
}

exports.fetchCategoryByName = (category) => {
    return db
        .query(
          `
        SELECT * FROM categories WHERE slug = $1`,
          [category]
        )
        .then((result) => {
          if (result.rowCount === 0) {
            return Promise.reject("No Category Found");
          }
          return result.rows[0];
        });
}
