const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  targetUrl: { type: String, required: true },
  campaign: { type: String, default: 'default_campaign' },
  trafficSource: { type: String, default: 'social' },
  landingEnabled: { type: Boolean, default: true },
  redirectType: { type: Number, enum: [301, 302], default: 302 },
  createdAt: { type: Date, default: Date.now },
  visitsCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Link', LinkSchema);
