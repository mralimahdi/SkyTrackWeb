const express = require('express');
const Link = require('../models/Link');
const Visit = require('../models/Visit');
const router = express.Router();

function normalizeSource(referer, sourceParam) {
  if (sourceParam) return sourceParam.toLowerCase();
  if (!referer) return 'direct';
  if (referer.includes('facebook.com')) return 'facebook';
  if (referer.includes('instagram.com')) return 'instagram';
  if (referer.includes('twitter.com')) return 'twitter';
  return 'other';
}

router.get('/:slug', async (req, res) => {
  const link = await Link.findOne({ slug: req.params.slug }).populate('agent');
  if (!link) {
    return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
  }

  const source = normalizeSource(req.get('Referer') || '', req.query.src);
  const visit = new Visit({
    link: link._id,
    agent: link.agent._id,
    source,
    referer: req.get('Referer') || 'unknown',
    ipAddress: req.ip,
    userAgent: req.get('User-Agent') || 'unknown',
  });

  await visit.save();
  link.visitsCount += 1;
  await link.save();

  if (source === 'facebook' && link.landingEnabled) {
    return res.sendFile(path.join(__dirname, '../public/landing.html'));
  }

  const target = link.targetUrl;
  const redirectType = link.redirectType === 301 ? 301 : 302;
  res.redirect(redirectType, target);
});

module.exports = router;
