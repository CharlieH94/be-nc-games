const { fetchJSON } = require('../models/endpoints-model.js');

exports.getEndpoints = (request, response, next) => {
    const endpoints = fetchJSON();
    response.status(200).send({ endpoints });
}