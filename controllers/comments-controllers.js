const { fetchComments, insertComment, fetchCommentById } = require('../models/comments-models.js')
const { fetchReviewById } = require('../models/reviews-models.js');

exports.getCommentsByReviewId = (request, response, next) => {
    const { review_id } = request.params;
    const reviewCheck = fetchReviewById(review_id);
    const commentsPromise = fetchComments(review_id);
    
    Promise.all([commentsPromise, reviewCheck])
        .then(([comments]) => {
            response.status(200).send({ comments });
        }).catch(error => next(error));
};
    
exports.postComment = (request, response, next) => {
    const { review_id } = request.params;
    const newComment = request.body;

    insertComment(newComment, review_id)
        .then((comment) => {
        response.status(201).send({ comment });
    })
    .catch((error) => next(error));
};

exports.deleteCommentByCommentId = (request, response, next) => {
    const { comment_id } = request.params;

    fetchCommentById(comment_id)
        .then(comment => {
            response.status(204).send();
        }).catch(error => next(error));
}