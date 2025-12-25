const express = require('express')
const router = express.Router()
const { getCounts } = require('../controllers/statsController')

router.get('/', getCounts)

module.exports = router
