const {
  fetchReviews,
  fetchReviewById,
  updateVotesByReviewId
} = require("../models/reviews-models.js");

exports.getReviews = (request, response, next) => {
  const { category } = request.query;

  fetchReviews(category)
    .then((reviews) => {
      console.log(reviews)
      response.status(200).send({ reviews });
    })
    .catch((error) => next(error));
};

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;

  fetchReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => next(error));
};

exports.patchReviewVotes = (request, response, next) => {
  const { review_id } = request.params;
  const voteObj = request.body

  updateVotesByReviewId(review_id, voteObj).then(review => {
    response.status(200).send({ review });
  })
    .catch(error => next(error));
}