const db = require('../db/connection');
const { commentData } = require('../db/data/test-data/index.js');

exports.fetchComments = (review_id) => {
    return db.query(`
    SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;
    `, [review_id]).then(result => result.rows);
};