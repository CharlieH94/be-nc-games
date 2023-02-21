const { insertComment } = require('../models/comments-models.js')

exports.postComment = (request, response, next) => {
    const {review_id} = request.params
    const newComment = request.body;

    insertComment(newComment, review_id).then(comment => {
        response.status(201).send({comment})
    })
    .catch((error) => next(error));
};