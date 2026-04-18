const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin');
const Agent = require('../models/Agent');

const router = express.Router();

function createEmailTransport() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: EMAIL_PORT === '465',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

async function sendResetEmail(to, token, accountType) {
  const transport = createEmailTransport();
  if (!transport) {
    console.warn('Email transport is not configured. Skipping email send.');
    return;
  }

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  const subject = `${accountType} Password Reset Request`;
  const body = `A password reset was requested for your ${accountType} account.\n\n` +
    `Click the link below to reset your password:\n\n${resetUrl}\n\n` +
    `If you did not request a reset, ignore this email.`;

  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: body,
  });
}

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin_login.html'));
});

router.get('/agent/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/agent_login.html'));
});

router.get('/admin/forgot', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin_forgot.html'));
});

router.get('/agent/forgot', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/agent_forgot.html'));
});

router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/reset_password.html'));
});

router.post('/admin/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin || !(await admin.verifyPassword(req.body.password))) {
      return res.redirect('/admin/login?error=invalid');
    }
    req.session.user = { id: admin._id, username: admin.username };
    req.session.role = 'admin';
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.redirect('/admin/login?error=failed');
  }
});

router.post('/agent/login', async (req, res) => {
  try {
    const agent = await Agent.findOne({ email: req.body.email });
    if (!agent || !(await agent.verifyPassword(req.body.password))) {
      return res.redirect('/agent/login?error=invalid');
    }
    req.session.user = { id: agent._id, name: agent.name, email: agent.email };
    req.session.role = 'agent';
    res.redirect('/agent/dashboard');
  } catch (error) {
    res.redirect('/agent/login?error=failed');
  }
});

router.post('/admin/forgot', async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      const token = crypto.randomBytes(20).toString('hex');
      admin.resetPasswordToken = token;
      admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await admin.save();
      await sendResetEmail(admin.email, token, 'Admin');
    }
    res.redirect('/admin/forgot?status=sent');
  } catch (error) {
    res.redirect('/admin/forgot?status=failed');
  }
});

router.post('/agent/forgot', async (req, res) => {
  try {
    const agent = await Agent.findOne({ email: req.body.email });
    if (agent) {
      const token = crypto.randomBytes(20).toString('hex');
      agent.resetPasswordToken = token;
      agent.resetPasswordExpires = Date.now() + 3600000;
      await agent.save();
      await sendResetEmail(agent.email, token, 'Agent');
    }
    res.redirect('/agent/forgot?status=sent');
  } catch (error) {
    res.redirect('/agent/forgot?status=failed');
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const token = req.body.token;
    const newPassword = req.body.password;
    const user = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }) || await Agent.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect('/reset-password?status=invalid');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.redirect('/login?reset=success');
  } catch (error) {
    res.redirect('/reset-password?status=failed');
  }
});

router.get('/setup', async (req, res) => {
  const existing = await Admin.findOne();
  if (existing) {
    return res.redirect('/admin/login');
  }
  const defaultAdmin = new Admin({
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: await bcrypt.hash('Admin@123', 10),
  });
  await defaultAdmin.save();
  res.send('Default admin created. Go to /admin/login with admin/Admin@123');
});

module.exports = router;
