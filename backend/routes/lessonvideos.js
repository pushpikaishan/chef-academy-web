const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lessonVideosController');
const uploadVideo = require('../middleware/uploadVideo');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.patch('/:id/video', uploadVideo.single('video'), ctrl.updateVideoFile);

module.exports = router;
