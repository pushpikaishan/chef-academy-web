const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPhoto,
  updateWatchStats,
} = require('../controllers/userController');
const upload = require('../middleware/upload');

const { generateCertificate } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/photo', upload.single('photo'), updateUserPhoto);
router.patch('/:id/watch', updateWatchStats);

// Certificate PDF route
router.get('/:id/certificate', generateCertificate);

module.exports = router;
