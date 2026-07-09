const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { config } = require("./config");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
