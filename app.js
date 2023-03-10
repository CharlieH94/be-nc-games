const express = require("express");
const { getCategories } = require("./controllers/categories-controllers.js");
const { getReviews, getReviewById, patchReviewVotes} = require("./controllers/reviews-controllers.js");
const { postComment, getCommentsByReviewId , deleteCommentByCommentId} = require("./controllers/comments-controllers.js");
const { handlePSQL400s, handleCustomErrors, handle500Statuses, handle404NonExistentPath } = require("./controllers/error-handling-controllers.js");
const { getUsers } = require('./controllers/users-controllers.js');
const { getEndpoints } = require('./controllers/endpoints-controller.js');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postComment)

app.patch("/api/reviews/:review_id", patchReviewVotes);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api", getEndpoints);

app.use("/*", handle404NonExistentPath);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
