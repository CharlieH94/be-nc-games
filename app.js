const express = require("express");
const { getCategories } = require("./controllers/categories-controllers.js");
const { getReviews, getReviewById} = require("./controllers/reviews-controllers.js");
const { getCommentsByReviewId, patchReviewVotes } = require("./controllers/comments-controllers.js");
const { handlePSQL400s, handleCustomErrors, handle500Statuses, handle404NonExistentPath } = require("./controllers/error-handling-controllers.js");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

// app.patch("/api/reviews/:review_id", patchReviewVotes);

app.use("/*", handle404NonExistentPath);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
