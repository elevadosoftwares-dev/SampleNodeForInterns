const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.connectionString)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => console.log(err));

module.exports = mongoose;