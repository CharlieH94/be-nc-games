exports.handle500Statuses = (error, req, res, next) => {
    console.log(error);
    res.status(500).send({ msg: "500: Internal Server Error"});
};