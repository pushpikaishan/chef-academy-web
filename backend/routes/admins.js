const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  updateAdminPhoto,
} = require('../controllers/adminController');
const upload = require('../middleware/upload');

router.get('/', getAdmins);
router.post('/', createAdmin);
router.get('/:id', getAdminById);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id/photo', upload.single('photo'), updateAdminPhoto);

module.exports = router;
