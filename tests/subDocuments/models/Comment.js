const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = mongoose.model(
	"Comment",
	new Schema({ name: String, for: new Schema({ article: { type: Schema.Types.ObjectId, refPath: "for.onModel" }, onModel: String }) })
);
