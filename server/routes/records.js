const express = require('express');
const Record = require('../models/Record');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Record.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, note } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const created = await Record.create({ title, note });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Record.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
