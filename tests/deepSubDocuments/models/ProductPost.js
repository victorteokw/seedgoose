const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = mongoose.model("ProductPost", new Schema({ name: String }));
