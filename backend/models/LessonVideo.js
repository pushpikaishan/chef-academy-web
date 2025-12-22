const mongoose = require('mongoose');
const { Schema } = mongoose;

const lessonVideoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    video: { type: String, default: '' }, // e.g., URL or storage path
    department: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('lessonvideo', lessonVideoSchema);
