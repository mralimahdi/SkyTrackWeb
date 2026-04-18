const express = require('express');
const path = require('path');
const Link = require('../models/Link');
const Visit = require('../models/Visit');
const Agent = require('../models/Agent');
const { ensureAgent } = require('../utils/auth');
const generateSlug = require('../utils/generateSlug');

const router = express.Router();
router.use(ensureAgent);

router.get('/dashboard', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/agent_dashboard.html'));
});

router.post('/links/new', async (req, res) => {
  try {
    const slug = generateSlug();
    await Link.create({
      slug,
      title: req.body.title || 'Agent Link',
      agent: req.session.user.id,
      targetUrl: req.body.targetUrl,
      campaign: req.body.campaign || 'agent_campaign',
      trafficSource: req.body.trafficSource || 'social',
      landingEnabled: req.body.landingEnabled === 'on',
      redirectType: Number(req.body.redirectType) || 302,
    });
    res.redirect('/agent/dashboard');
  } catch (error) {
    res.redirect('/agent/dashboard');
  }
});

module.exports = router;
