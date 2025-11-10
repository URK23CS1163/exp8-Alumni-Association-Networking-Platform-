const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} already in use` });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(24).toString('hex');
    const user = await User.create({ name, email, username, passwordHash, verifyToken, verified: false });

    const host = process.env.SMTP_HOST;
    const userEmail = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || userEmail;
    const frontend = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    if (host && userEmail && pass && from) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port: Number(process.env.SMTP_PORT || 587),
          secure: false,
          auth: { user: userEmail, pass },
        });
        const link = `${frontend.replace(/\/$/, '')}/verify?token=${verifyToken}`;
        await transporter.sendMail({
          from,
          to: email,
          subject: 'Verify your email',
          text: `Verify your account: ${link}`,
          html: `<p>Verify your account:</p><p><a href="${link}">${link}</a></p>`,
        });
      } catch (e) {}
    }

    res.status(201).json({ id: user._id, name: user.name, email: user.email, username: user.username, verifyToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    if (!identifier || !password) return res.status(400).json({ message: 'Missing credentials' });
    const query = identifier.includes('@') ? { email: identifier } : { username: identifier };
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, username: user.username, verified: user.verified } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Missing token' });
    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.verified = true;
    user.verifyToken = undefined;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing email' });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link was sent' });
    const resetToken = crypto.randomBytes(24).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const host = process.env.SMTP_HOST;
    const userEmail = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || userEmail;
    const frontend = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    if (host && userEmail && pass && from) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port: Number(process.env.SMTP_PORT || 587),
          secure: false,
          auth: { user: userEmail, pass },
        });
        const link = `${frontend.replace(/\/$/, '')}/reset?token=${resetToken}`;
        await transporter.sendMail({
          from,
          to: email,
          subject: 'Reset your password',
          text: `Reset your password: ${link}`,
          html: `<p>Reset your password:</p><p><a href="${link}">${link}</a></p>`,
        });
      } catch (e) {}
    }

    res.json({ message: 'If the email exists, a reset link was sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dev mailbox: returns current verify/reset links for a given email (for local testing, no SMTP required)
router.get('/dev-links', async (req, res) => {
  try {
    if (process.env.ENABLE_DEV_MAILBOX !== 'true') {
      return res.status(403).json({ message: 'Disabled' });
    }
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Missing email' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Not found' });
    const frontend = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    const make = (path) => `${frontend.replace(/\/$/, '')}${path}`;
    const verifyLink = user.verifyToken ? make(`/verify?token=${user.verifyToken}`) : null;
    const resetLink = user.resetToken ? make(`/reset?token=${user.resetToken}`) : null;
    res.json({ email, verifyLink, resetLink, expiresAt: user.resetTokenExpires || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
