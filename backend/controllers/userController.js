const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const LessonVideo = require('../models/LessonVideo');

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
    const { department, lessonVideoId } = req.body || {};
    if (!department || typeof department !== 'string') {
      return res.status(400).json({ error: 'department is required' });
    }
    if (!lessonVideoId || !mongoose.Types.ObjectId.isValid(lessonVideoId)) {
      return res.status(400).json({ error: 'lessonVideoId is required' });
    }
    const d = department.toLowerCase();
    let deptKey = null;
    if (d.includes('kitchen')) deptKey = 'kitchen';
    else if (d.includes('bakery')) deptKey = 'bakery';
    else if (d.includes('butch')) deptKey = 'butchery';
    else return res.status(400).json({ error: 'Unknown department' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'Not found' });

    // Debug log incoming department and lessonVideoId
    console.log('updateWatchStats called:', { department, lessonVideoId });

    // Check if already watched
    const watchedDept = user.watchStats?.watched?.[deptKey] || [];
    const watchedAll = user.watchStats?.watched?.all || [];
    const alreadyWatched = watchedDept.some(v => v.toString() === lessonVideoId) || watchedAll.some(v => v.toString() === lessonVideoId);
    if (alreadyWatched) {
      // No increment, just return user
      const { password: _, ...safe } = user.toObject();
      return res.json(safe);
    }

    // Add to watched arrays and increment counters
    const update = {
      $addToSet: {
        [`watchStats.watched.${deptKey}`]: lessonVideoId,
        'watchStats.watched.all': lessonVideoId
      },
      $inc: {
        [`watchStats.${deptKey}`]: 1,
        'watchStats.total': 1
      }
    };
    const updatedUser = await User.findByIdAndUpdate(id, update, { new: true });
    const { password: _, ...safe } = updatedUser.toObject();
    return res.json(safe);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update watch stats' });
  }
};

// Generate certificate for a user
exports.generateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch real lesson totals by department
    const allLessons = await LessonVideo.find({}, 'department');
    const totalsByDept = { kitchen: 0, bakery: 0, butchery: 0 };
    for (const lesson of allLessons) {
      const d = (lesson.department || '').toLowerCase();
      if (d.includes('kitchen')) totalsByDept.kitchen++;
      else if (d.includes('bakery')) totalsByDept.bakery++;
      else if (d.includes('butch')) totalsByDept.butchery++;
    }

    const departments = [
      { label: 'Hot and Cold Kitchen', key: 'kitchen' },
      { label: 'Bakery and Pastry', key: 'bakery' },
      { label: 'Butchery and Fish', key: 'butchery' }
    ];

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    const filename = `certificate-${user._id}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    const w = doc.page.width;
    const h = doc.page.height;

    doc.pipe(res);

    // ===== LUXE BLACK BACKGROUND =====
    doc.rect(0, 0, w, h).fill('#ffffff');
    
    // ===== TOP GRADIENT ACCENT BAR =====
    doc.rect(0, 0, w, 100).fill('#f5f5f5');
    doc.fillColor('#ff8800').opacity(0.2);
    doc.rect(0, 0, w, 100).fill();
    doc.opacity(1);

    // ===== DECORATIVE CORNER ACCENTS =====
    doc.fillColor('#ffc107').rect(0, 0, 60, 6).fill();
    doc.fillColor('#ff8800').rect(0, 6, 100, 4).fill();
    doc.fillColor('#ffc107').rect(w - 60, 0, 60, 6).fill();
    doc.fillColor('#ff8800').rect(w - 100, 6, 100, 4).fill();

    // ===== MAIN TITLE WITH STYLING =====
    doc.fillColor('#ffc107').fontSize(52).font('Helvetica-Bold')
      .text('CHEF ACADEMY', 50, 60, { align: 'center', width: w - 100 });
    
    doc.fillColor('#ff8800').fontSize(16).font('Helvetica-Bold')
      .text('Certificate of Excellence', 50, 120, { align: 'center', width: w - 100 });

    // ===== DECORATIVE LINE =====
    doc.strokeColor('#ffc107').lineWidth(3);
    doc.moveTo(w / 2 - 200, 145).lineTo(w / 2 + 200, 145).stroke();

    // ===== APP ICON =====
    const iconPath = path.join(__dirname, '../../frontend/src/assets/images/appicon.png');
    try {
      if (fs.existsSync(iconPath)) {
        doc.image(iconPath, w / 2 - 50, 165, { width: 100 });
      }
    } catch (imgErr) {
      console.warn('Icon not found, skipping:', imgErr.message);
    }

    // ===== RECIPIENT SECTION =====
    doc.fillColor('#ffffff').fontSize(14).font('Helvetica')
      .text('This certificate is proudly presented to', 50, 285, { align: 'center', width: w - 100 });
    
    doc.fillColor('#ffc107').fontSize(44).font('Helvetica-Bold')
      .text(user.name.toUpperCase(), 50, 310, { align: 'center', width: w - 100 });
    
    doc.fillColor('#ffb300').fontSize(13).font('Helvetica')
      .text('For demonstrating exceptional culinary skill and dedication', 50, 365, { align: 'center', width: w - 100 });

    // ===== DEPARTMENT PROGRESS BOXES WITH ENHANCED STYLING =====
    const boxW = 220;
    const boxH = 110;
    const startX = (w - boxW * 3 - 50) / 2;
    const startY = 400;

    departments.forEach(({ label, key }, idx) => {
      const x = startX + idx * (boxW + 25);
      const watchedArr = user.watchStats?.watched?.[key] || [];
      const watchedCount = Array.isArray(watchedArr) ? watchedArr.length : 0;
      const total = totalsByDept[key] || 0;
      const pct = total ? Math.min(100, Math.round((watchedCount / total) * 100)) : 0;

      // Box shadow effect (dark line)
      doc.fillColor('#000000').opacity(0.1);
      doc.rect(x + 4, startY + 4, boxW, boxH).fill();
      doc.opacity(1);

      // Box background
      doc.fillColor('#F5DEB3').rect(x, startY, boxW, boxH).fill();
      
      // Gold border with glow effect
      doc.strokeColor('#ffc107').lineWidth(0.5);
      doc.rect(x, startY, boxW, boxH).stroke();

      // Inner accent line
      doc.strokeColor('#ffffff').lineWidth(1);
      doc.moveTo(x, startY + 35).lineTo(x + boxW, startY + 35).stroke();

      // Department label
      doc.fillColor('#E64E35').fontSize(13).font('Helvetica-Bold')
        .text(label, x + 15, startY + 10, { width: boxW - 30, align: 'center' });

      // Progress bar background
      const barY = startY + 50;
      const barW = boxW - 30;
      doc.fillColor('#ffffff').rect(x + 15, barY, barW, 14).fill();
      doc.strokeColor('#ffffff').lineWidth(1).rect(x + 15, barY, barW, 14).stroke();

      // Progress bar fill - color changes with progress
      const fillW = (barW * pct) / 100;
      let barColor = '#fec818'; // Red for low
      if (pct >= 75) barColor = '#ff9500'; // Green for high
      else if (pct >= 50) barColor = '#ffae00'; // Orange for medium
      
      doc.fillColor(barColor).rect(x + 15, barY, fillW, 14).fill();

      // Percentage text with shadow
      
      doc.fillColor('#E64E35').fontSize(12).font('Helvetica-Bold')
        .text(`${pct}%`, x + 15, barY + 24, { width: barW, align: 'center' });
    });


    // ===== ACHIEVEMENT FOOTER =====
    doc.fillColor('#ff8800').fontSize(18).font('Helvetica-Bold')
      .text('Congratulations!', 50, 540, { align: 'center', width: w - 100 });
    
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica')
      .text('You have successfully mastered the art of culinary excellence', 50, 565, { align: 'center', width: w - 100 });

    // ===== BOTTOM ACCENT BAR =====
    doc.rect(0, h - 70, w, 70).fill('#f5f5f5');
    doc.fillColor('#ff8800').opacity(0.2);
    doc.rect(0, h - 70, w, 70).fill();
    doc.opacity(1);

    // Decorative line
    doc.strokeColor('#ffc107').lineWidth(2);
    doc.moveTo(50, h - 65).lineTo(w - 50, h - 65).stroke();

    // ===== FOOTER TEXT =====
    doc.fillColor('#ffb300').fontSize(11).font('Helvetica-Bold')
      .text(`Issued: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 
        50, h - 50, { align: 'left' });
    
    doc.fillColor('#ffc107').fontSize(10).font('Helvetica')
      .text('Certificate ID: ' + user._id.toString().substring(0, 12).toUpperCase(), w - 250, h - 50, { align: 'right', width: 200 });

    doc.fillColor('#ff8800').fontSize(9).font('Helvetica')
      .text('Chef Academy - Culinary Excellence', 50, h - 25, { align: 'center', width: w - 100 });

    // Corner flourishes
    doc.fillColor('#ffc107').rect(0, h - 6, 60, 6).fill();
    doc.fillColor('#ff8800').rect(0, h - 10, 100, 4).fill();
    doc.fillColor('#ffc107').rect(w - 60, h - 6, 60, 6).fill();
    doc.fillColor('#ff8800').rect(w - 100, h - 10, 100, 4).fill();

    doc.end();
  } catch (err) {
    console.error('Certificate generation error:', err);
    return res.status(500).json({ error: 'Failed to generate certificate' });
  }
};