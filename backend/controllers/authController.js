const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

function toSafe(obj, role) {
  const { password, ...rest } = obj.toObject();
  return { ...rest, role };
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Try user first
    let account = await User.findOne({ email });
    if (account) {
      const ok = await bcrypt.compare(password, account.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const role = account.role || 'user';
      const token = jwt.sign({ sub: account._id.toString(), role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
      const safe = toSafe(account, role);
      return res.json({ token, role, id: account._id, ...safe });
    }

    // Try admin
    account = await Admin.findOne({ email });
    if (account) {
      const ok = await bcrypt.compare(password, account.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const role = 'admin';
      const token = jwt.sign({ sub: account._id.toString(), role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
      const safe = toSafe(account, role);
      return res.json({ token, role, id: account._id, ...safe });
    }

    return res.status(404).json({ error: 'Account not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
};
