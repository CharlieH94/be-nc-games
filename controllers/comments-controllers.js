const { fetchComments } = require('../models/comments-models.js')

exports.getCommentsByReviewId = (request, response, next) => {
    const { review_id } = request.params;
    fetchComments(review_id).then(comments => {
        response.status(200).send({comments})
    })
}