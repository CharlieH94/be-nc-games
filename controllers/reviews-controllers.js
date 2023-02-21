const {
  fetchReviews,
  fetchReviewById,
} = require("../models/reviews-models.js");

exports.getReviews = (request, response, next) => {
  fetchReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((error) => next(error));
};

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;

    fetchReviewById(review_id).then((review) => {
        console.log(review);
    response.status(200).send({ review });
  });
};
