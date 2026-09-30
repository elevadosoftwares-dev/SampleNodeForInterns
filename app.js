const express = require("express");
const errorHandler = require("./middleware/error");

const app = express();

app.use("/sample", require("./router/sampleRouter"))

app.use((req, res, next) => {
    const err = new Error("Route Not Found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);


module.exports = app;