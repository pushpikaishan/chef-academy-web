const Recipe = require('../models/Recipes');
const mongoose = require('mongoose');

exports.createRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, directions, serving, time, department, category, photo, video, link } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const recipe = await Recipe.create({ name, description, ingredients, directions, serving, time, department, category, photo, video, link });
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
    const allowed = ['name', 'description', 'ingredients', 'directions', 'serving', 'time', 'department', 'category', 'photo', 'video', 'link'];
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
