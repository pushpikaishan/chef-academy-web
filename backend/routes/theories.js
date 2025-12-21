const express = require('express');
const router = express.Router();
const {
  createTheory,
  getTheories,
  getTheoryById,
  updateTheory,
  deleteTheory,
  addTheoryPhotos,
} = require('../controllers/theoryController');
const upload = require('../middleware/upload');

router.get('/', getTheories);
router.post('/', createTheory);
router.get('/:id', getTheoryById);
router.put('/:id', updateTheory);
router.delete('/:id', deleteTheory);
router.patch('/:id/photos', upload.array('photos', 10), addTheoryPhotos);

module.exports = router;
