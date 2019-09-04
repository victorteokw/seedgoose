const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = mongoose.model(
	"Comment",
	new Schema({
		body: { type: String, required: true },
		postLink: new Schema({
			linkedTo: {
				type: Schema.Types.ObjectId,
				required: true
			}
		})
	})
);
