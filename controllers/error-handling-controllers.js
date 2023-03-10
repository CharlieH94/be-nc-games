exports.handlePSQL400s = (error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ msg: 'Bad Request' });
    } else if (error.code === '23502') {
        response.status(400).send({ msg: 'Missing Required Properties' });
    } else if (error.code === '23503') {
        response.status(404).send({ msg: 'Not Found' });
    } else {
        next(error);
    }
}

exports.handleCustomErrors = (error, request, response, next) => {
    if (error === 'No ID Found' || error === 'No Category Found') {
        response.status(404).send({msg: 'Not Found'})
    } else if (error === 'Invalid Sort Query' || error === 'Invalid Order Query') {
        response.status(400).send({msg: error})
    } else {
        next(error);
    }
}

exports.handle500Statuses = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: "500: Internal Server Error"});
};

exports.handle404NonExistentPath = (request, response, next) => {
    response.status(404).send({msg: 'Path Not Found'})
}