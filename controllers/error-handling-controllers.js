exports.handle500Statuses = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: "500: Internal Server Error"});
};

exports.handle404NonExistentPath = (request, response, next) => {
    response.status(404).send({msg: 'Path Not Found'})
}