const express = require("express");
const { getCategories } = require("./controllers/categories-controllers.js");
const { getReviews } = require("./controllers/reviews-controllers.js");
const { handle500Statuses, handle404Status } = require("./controllers/error-handling-controllers.js");

const app = express();


app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)

app.use(handle500Statuses);

app.use(handle404Status)

module.exports = app;
