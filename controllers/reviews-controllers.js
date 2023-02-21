const { fetchReviews } = require('../models/reviews-models.js')

exports.getReviews = (request, response, next) => {
    fetchReviews()
        .then(reviews => {
            response.status(200).send({ reviews });
        }).catch(error => next(error));
};