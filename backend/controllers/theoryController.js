const Theory = require('../models/Theory');
const mongoose = require('mongoose');

exports.createTheory = async (req, res) => {
  try {
    const { title, description, department, submitDate, photos } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const payload = { title, description, department };
    if (submitDate) payload.submitDate = new Date(submitDate);
    if (Array.isArray(photos)) payload.photos = photos;
    const theory = await Theory.create(payload);
    return res.status(201).json(theory);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.getTheories = async (req, res) => {
  const { department } = req.query;
  const filter = {};
  if (department) filter.department = department;
  const theories = await Theory.find(filter).sort({ createdAt: -1 });
  return res.json(theories);
};

exports.getTheoryById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const theory = await Theory.findById(id);
  if (!theory) return res.status(404).json({ error: 'Not found' });
  return res.json(theory);
};

exports.updateTheory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const allowed = ['title', 'description', 'department', 'submitDate', 'photos'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.submitDate) updates.submitDate = new Date(updates.submitDate);
    const theory = await Theory.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!theory) return res.status(404).json({ error: 'Not found' });
    return res.json(theory);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.deleteTheory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const theory = await Theory.findByIdAndDelete(id);
  if (!theory) return res.status(404).json({ error: 'Not found' });
  return res.status(204).send();
};

exports.addTheoryPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photos uploaded' });
    }
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    const theory = await Theory.findByIdAndUpdate(
      id,
      { $push: { photos: { $each: urls } } },
      { new: true }
    );
    if (!theory) return res.status(404).json({ error: 'Not found' });
    return res.json(theory);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update photos' });
  }
};
