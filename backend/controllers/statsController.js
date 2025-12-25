const LessonVideo = require('../models/LessonVideo')
const Recipe = require('../models/Recipes')
const Theory = require('../models/Theory')
const User = require('../models/User')

// GET /stats?department=Kitchen
// Returns counts for lessons, recipes, and theories filtered by department
exports.getCounts = async (req, res) => {
  try {
    const department = (req.query.department || '').trim()
    const filter = department ? { department } : {}

    const [lessons, recipes, theories, users] = await Promise.all([
      LessonVideo.countDocuments(filter),
      Recipe.countDocuments(filter),
      Theory.countDocuments(filter),
      // Users are not department-scoped; count all when no filter
      User.countDocuments(department ? {} : {})
    ])

    return res.json({ lessons, recipes, theories, users })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to get counts' })
  }
}
