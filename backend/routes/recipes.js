const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  updateRecipePhoto,
  likeRecipe,
  unlikeRecipe,
} = require('../controllers/recipesController');
const upload = require('../middleware/upload');

router.get('/', getRecipes);
router.post('/', createRecipe);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.patch('/:id/photo', upload.single('photo'), updateRecipePhoto);
router.post('/:id/like', likeRecipe);
router.post('/:id/unlike', unlikeRecipe);

module.exports = router;
