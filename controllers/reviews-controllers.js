const {
  fetchReviews,
  fetchReviewById,
  updateVotesByReviewId
} = require("../models/reviews-models.js");
const {fetchCategoryByName} = require('../models/categories-models.js')

exports.getReviews = (request, response, next) => {
  const { category, sort_by, order } = request.query;
  const reviewsPromise = fetchReviews(category, sort_by, order);
  const promiseArray = [reviewsPromise];

  if (category !== undefined) {
    const categoryCheck = fetchCategoryByName(category);
    promiseArray.push(categoryCheck);
  }
  
  Promise.all(promiseArray)
  .then(([reviews]) => {
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