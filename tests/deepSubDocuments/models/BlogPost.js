const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = mongoose.model("BlogPost", new Schema({ title: String }));
