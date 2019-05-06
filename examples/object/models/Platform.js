const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Platform', new Schema({ name: String }));
