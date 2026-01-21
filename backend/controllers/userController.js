const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { name, email, status, profileImage, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, status, profileImage, role, password: hashedPassword });
    const { password: _, ...safe } = user.toObject();
    return res.status(201).json(safe);
  } catch (err) {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.getUsers = async (_req, res) => {
  const users = await User.find();
  const safeUsers = users.map(u => {
    const { password: _, ...safe } = u.toObject();
    return safe;
  });
  return res.json(safeUsers);
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...safe } = user.toObject();
    return res.json(safe);
  } catch (_err) {
    return res.status(400).json({ error: 'Invalid id' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const updates = {};
    const allowed = ['name', 'email', 'status', 'profileImage', 'role'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...safe } = user.toObject();
    return res.json(safe);
  } catch (err) {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  } catch (_err) {
    return res.status(400).json({ error: 'Invalid id' });
  }
};

exports.updateUserPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    let photoUrl = null;

    // ✅ CASE 1: Multipart file upload (mobile/web)
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // ✅ CASE 2: Image URL upload (JSON)
    if (!photoUrl && req.body.profileImage) {
      photoUrl = req.body.profileImage;
    }

    if (!photoUrl) {
      return res.status(400).json({ error: 'No photo or image URL provided' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { profileImage: photoUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Not found' });
    }

    const { password: _, ...safe } = user.toObject();
    return res.json(safe);

  } catch (err) {
    console.error('updateUserPhoto error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update photo' });
  }
};


// Increment watch stats for a user by department
exports.updateWatchStats = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const { department } = req.body || {};
    if (!department || typeof department !== 'string') {
      return res.status(400).json({ error: 'department is required' });
    }
    const d = department.toLowerCase();
    let field = null;
    if (d.includes('kitchen')) field = 'watchStats.kitchen';
    else if (d.includes('bakery')) field = 'watchStats.bakery';
    else if (d.includes('butch')) field = 'watchStats.butchery';
    else return res.status(400).json({ error: 'Unknown department' });

    const inc = { [field]: 1, 'watchStats.total': 1 };
    const user = await User.findByIdAndUpdate(id, { $inc: inc }, { new: true });
    if (!user) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...safe } = user.toObject();
    return res.json(safe);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update watch stats' });
  }
};
