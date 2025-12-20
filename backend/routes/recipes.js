const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  updateRecipePhoto,
} = require('../controllers/recipesController');
const upload = require('../middleware/upload');

router.get('/', getRecipes);
router.post('/', createRecipe);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.patch('/:id/photo', upload.single('photo'), updateRecipePhoto);

module.exports = router;
