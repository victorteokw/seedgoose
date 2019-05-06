const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const postSchema = new Schema({
  title: { type: String, trim: true },
  content: { type: String, trim: true },
  author: { type: ObjectId, ref: 'Author' },
  comments: [{ type: ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
