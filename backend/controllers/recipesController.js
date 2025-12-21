const Recipe = require('../models/Recipes');
const mongoose = require('mongoose');

exports.createRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, directions, serving, time, department, category, photo, videolink } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const recipe = await Recipe.create({ name, description, ingredients, directions, serving, time, department, category, photo, videolink });
    return res.status(201).json(recipe);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.getRecipes = async (_req, res) => {
  const recipes = await Recipe.find();
  return res.json(recipes);
};

exports.getRecipeById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const recipe = await Recipe.findById(id);
  if (!recipe) return res.status(404).json({ error: 'Not found' });
  return res.json(recipe);
};

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const allowed = ['name', 'description', 'ingredients', 'directions', 'serving', 'time', 'department', 'category', 'photo', 'videolink'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const recipe = await Recipe.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    return res.json(recipe);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid payload' });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const recipe = await Recipe.findByIdAndDelete(id);
  if (!recipe) return res.status(404).json({ error: 'Not found' });
  return res.status(204).send();
};

exports.updateRecipePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { photo: photoUrl },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    return res.json(recipe);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update photo' });
  }
};

exports.likeRecipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    return res.json({ likes: recipe.likes });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to like recipe' });
  }
};

exports.unlikeRecipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, likes: { $gt: 0 } },
      { $inc: { likes: -1 } },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ error: 'Not found or already zero' });
    return res.json({ likes: recipe.likes });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to unlike recipe' });
  }
};
