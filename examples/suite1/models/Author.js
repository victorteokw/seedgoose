const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const authorSchema = new Schema({
  name: { type: String, trim: true },
  posts: [{ type: ObjectId, ref: 'Post' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Author', authorSchema);
