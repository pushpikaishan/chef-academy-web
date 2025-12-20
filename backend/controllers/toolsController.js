const Tool = require('../models/Tools');
const mongoose = require('mongoose');

exports.createTool = async (req, res) => {
  try {
    const { name, photo, description, category, department } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const tool = await Tool.create({ name, photo, description, category, department });
    return res.status(201).json(tool);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.getTools = async (_req, res) => {
  const tools = await Tool.find();
  return res.json(tools);
};

exports.getToolById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const tool = await Tool.findById(id);
  if (!tool) return res.status(404).json({ error: 'Not found' });
  return res.json(tool);
};

exports.updateTool = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const allowed = ['name', 'photo', 'description', 'category', 'department'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const tool = await Tool.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!tool) return res.status(404).json({ error: 'Not found' });
    return res.json(tool);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.deleteTool = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const tool = await Tool.findByIdAndDelete(id);
  if (!tool) return res.status(404).json({ error: 'Not found' });
  return res.status(204).send();
};

exports.updateToolPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    const tool = await Tool.findByIdAndUpdate(
      id,
      { photo: photoUrl },
      { new: true }
    );
    if (!tool) return res.status(404).json({ error: 'Not found' });
    return res.json(tool);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update photo' });
  }
};
