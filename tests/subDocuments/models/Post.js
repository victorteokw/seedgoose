const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = mongoose.model("Post", new Schema({ name: String }));
