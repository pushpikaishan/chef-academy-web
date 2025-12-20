const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPhoto,
} = require('../controllers/userController');
const upload = require('../middleware/upload');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/photo', upload.single('photo'), updateUserPhoto);

module.exports = router;
