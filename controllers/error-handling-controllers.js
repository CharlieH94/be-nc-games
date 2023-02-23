exports.handlePSQL400s = (error, request, response, next) => {
    // console.log(error.code, error.message);
    if (error.code === '22P02' || error.code === '23503') {
        response.status(400).send({ msg: 'Bad Request' });
    } else if (error.code === '23502') {
        response.status(400).send({ msg: 'Missing Required Properties' });
    } else {
        next(error);
    }
}

// error.message === 
// insert or update on table "comments" violates foreign key constraint "comments_author_fkey"'
// insert or update on table "comments" violates foreign key constraint "comments_review_id_fkey"
// response.status(404).send({ msg: 'Not Found' })

exports.handleCustomErrors = (error, request, response, next) => {
    if (error === 'No ID Found') {
        response.status(404).send({msg: 'Not Found'})
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