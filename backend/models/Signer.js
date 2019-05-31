const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:{ type: String, required: true },
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  email:{ type: String, default: '' },
  color:String,
  shared_with: [],
  created_at:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('Signer', schema);