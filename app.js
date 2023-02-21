const express = require("express");
const { getCategories } = require("./controllers/categories-controllers.js");
const { getReviewById } = require("./controllers/reviews-controllers.js");
const { handle500Statuses } = require("./controllers/error-handling-controllers.js");

const app = express();


app.get("/api/categories", getCategories);

app.get('api/reviews/:review_id', getReviewById);

app.use(handle500Statuses);

module.exports = app;
