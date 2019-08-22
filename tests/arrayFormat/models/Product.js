const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Product', new Schema({ name: String }));
