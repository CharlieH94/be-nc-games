const { fetchCategories } = require('../models/categories-models.js')

exports.getCategories = (request, response, next) => {
    fetchCategories()
        .then(categories => {
            response.status(200).send({ categories });
        }).catch(error => next(error));
};
