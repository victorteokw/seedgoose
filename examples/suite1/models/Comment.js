const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const commentSchema = new Schema({
  content: { type: String, trim: true },
  comments: [{ type: ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
