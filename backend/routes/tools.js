const express = require('express');
const router = express.Router();
const {
  createTool,
  getTools,
  getToolById,
  updateTool,
  deleteTool,
  updateToolPhoto,
} = require('../controllers/toolsController');
const upload = require('../middleware/upload');

router.get('/', getTools);
router.post('/', createTool);
router.get('/:id', getToolById);
router.put('/:id', updateTool);
router.delete('/:id', deleteTool);
router.patch('/:id/photo', upload.single('photo'), updateToolPhoto);

module.exports = router;
