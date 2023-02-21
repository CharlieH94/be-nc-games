const express = require("express");
const { getCategories } = require("./controllers/categories-controllers.js");
const { getReviews, getReviewById} = require("./controllers/reviews-controllers.js");
const { handle500Statuses, handle404NonExistentPath } = require("./controllers/error-handling-controllers.js");

const app = express();


app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)

app.get("/api/reviews/:review_id", getReviewById);

app.use("/*", handle404NonExistentPath)

app.use(handle500Statuses);

module.exports = app;
