const mongoose = require("mongoose");

const schema = mongoose.Schema;

const sampleSchema = new schema({
    sampleId: { type: Number },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    address: { type: String }
});

const sampleCollection = mongoose.model("user", sampleSchema);

module.exports = sampleCollection;