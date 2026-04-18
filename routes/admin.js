const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');
const Link = require('../models/Link');
const Visit = require('../models/Visit');
const { ensureAdmin } = require('../utils/auth');
const generateSlug = require('../utils/generateSlug');

const router = express.Router();

router.use(ensureAdmin);

router.get('/dashboard', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin_dashboard.html'));
});

router.get('/agents/new', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin_agent_new.html'));
});

router.post('/agents/new', async (req, res) => {
  try {
    const existing = await Agent.findOne({ email: req.body.email });
    if (existing) {
      return res.redirect('/admin/agents/new?error=exists');
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await Agent.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
    });
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.redirect('/admin/agents/new?error=failed');
  }
});

router.post('/links/new', async (req, res) => {
  try {
    const slug = generateSlug();
    await Link.create({
      slug,
      title: req.body.title,
      agent: req.body.agentId,
      targetUrl: req.body.targetUrl,
      campaign: req.body.campaign || 'admin_campaign',
      trafficSource: req.body.trafficSource || 'social',
      landingEnabled: req.body.landingEnabled === 'on',
      redirectType: Number(req.body.redirectType) || 302,
    });
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

module.exports = router;
