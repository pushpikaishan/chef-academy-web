const mongoose = require('mongoose')
const UserQuestion = require('../models/UserQuestion')

exports.create = async (req, res) => {
  try {
    const { userId, name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' })
    }

    const payload = { name, email, message }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      payload.user = userId
    }

    const doc = await UserQuestion.create(payload)
    return res.status(201).json(doc)
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to submit question' })
  }
}

exports.list = async (_req, res) => {
  try {
    const items = await UserQuestion.find().sort({ createdAt: -1 })
    return res.json(items)
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch questions' })
  }
}

exports.remove = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }
  try {
    const doc = await UserQuestion.findByIdAndDelete(id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    return res.status(204).send()
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to delete question' })
  }
}
