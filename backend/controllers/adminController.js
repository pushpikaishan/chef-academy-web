const Admin = require('../models/Admin');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, profilePhoto, profilephoto } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePhoto: profilePhoto ?? profilephoto,
    });
    const { password: _, ...safe } = admin.toObject();
    return res.status(201).json(safe);
  } catch (err) {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.getAdmins = async (_req, res) => {
  const admins = await Admin.find();
  const safe = admins.map(a => {
    const { password: _, ...rest } = a.toObject();
    return rest;
  });
  return res.json(safe);
};

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...safe } = admin.toObject();
    return res.json(safe);
  } catch (_err) {
    return res.status(400).json({ error: 'Invalid id' });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const allowed = ['name', 'email', 'role', 'profilePhoto'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (req.body.profilephoto && updates.profilePhoto === undefined) {
      updates.profilePhoto = req.body.profilephoto;
    }
    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }
    const admin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!admin) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...safe } = admin.toObject();
    return res.json(safe);
  } catch (err) {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  } catch (_err) {
    return res.status(400).json({ error: 'Invalid id' });
  }
};

exports.updateAdminPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    const admin = await Admin.findByIdAndUpdate(
      id,
      { profilePhoto: photoUrl },
      { new: true }
    );
    if (!admin) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...safe } = admin.toObject();
    return res.json(safe);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update photo' });
  }
};
