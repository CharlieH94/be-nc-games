const db = require('../db/connection');
const { reviewData } = require('../db/data/test-data/index.js');

exports.fetchReviews = () => {
    return db.query(`SELECT reviews.owner, reviews.title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST(COUNT(comment_id) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`)
    .then(reviewData => {
        return reviewData.rows;
    })
}

exports.fetchReviewById = (id) => {

}