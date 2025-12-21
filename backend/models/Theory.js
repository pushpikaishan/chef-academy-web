const mongoose = require('mongoose');
const { Schema } = mongoose;

const theorySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    photos: { type: [String], default: [] },
    department: { type: String, default: '' },
    submitDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('theory', theorySchema);
