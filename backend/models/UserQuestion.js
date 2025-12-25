const mongoose = require('mongoose')

const UserQuestionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: { createdAt: true, updatedAt: false } })

UserQuestionSchema.index({ createdAt: -1 })

module.exports = mongoose.models.UserQuestion || mongoose.model('UserQuestion', UserQuestionSchema)
