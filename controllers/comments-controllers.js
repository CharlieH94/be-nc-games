const { fetchComments } = require('../models/comments-models.js')
const { selectReviewById } = require('../models/reviews-models.js');

exports.getCommentsByReviewId = (request, response, next) => {
    const { review_id } = request.params;
    const reviewCheck = selectReviewById(review_id);
    const commentsPromise = fetchComments(review_id)
    
    Promise.all([commentsPromise, reviewCheck])
        .then(( [comments] ) => {
            response.status(200).send({ comments })
    }).catch(error => next(error));
}