const express = require("express");
const { getCategories } = require("./controllers/categories-controllers.js");
const { handle500Statuses } = require("./controllers/error-handling-controllers.js");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use(handle500Statuses);

module.exports = app;
