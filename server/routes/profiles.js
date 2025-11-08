const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    const filter = {};
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { department: new RegExp(q, 'i') },
        { currentCompany: new RegExp(q, 'i') },
        { skills: new RegExp(q, 'i') },
      ];
    }
    const users = await User.find(filter).select('-passwordHash');
    res.json(users);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
