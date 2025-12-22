const LessonVideo = require('../models/LessonVideo');

exports.list = async (req, res) => {
  try {
    const items = await LessonVideo.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch lessons' });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await LessonVideo.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch lesson' });
  }
};

exports.create = async (req, res) => {
  try {
    const item = new LessonVideo({
      title: req.body.title,
      description: req.body.description || '',
      video: req.body.video || '',
      department: req.body.department || '',
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create lesson' });
  }
};

exports.update = async (req, res) => {
  try {
    const update = {
      title: req.body.title,
      description: req.body.description,
      video: req.body.video,
      department: req.body.department,
    };
    const item = await LessonVideo.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update lesson' });
  }
};

// Upload and update video file path
exports.updateVideoFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });
    const filePath = `/uploads/${req.file.filename}`;
    const item = await LessonVideo.findByIdAndUpdate(
      req.params.id,
      { video: filePath },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update lesson video' });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await LessonVideo.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete lesson' });
  }
};
