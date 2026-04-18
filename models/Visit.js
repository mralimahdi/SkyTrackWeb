const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  link: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  source: { type: String, default: 'unknown' },
  referer: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Visit', VisitSchema);
