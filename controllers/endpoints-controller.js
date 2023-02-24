const { fetchJSON } = require('../models/endpoints-model.js');

exports.getEndpoints = (request, response, next) => {
    fetchJSON()
        .then(endpoints => {
            // console.log(endpoints);
        response.status(200).send({endpoints})
    })
}