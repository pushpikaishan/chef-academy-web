const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, default: '' },
		ingredients: { type: [String], default: [] },
		directions: { type: [String], default: [] },
		serving: { type: Number, default: 0 },
		time: { type: Number, default: 0 },
		department: { type: String, default: '' },
		category: { type: String, default: '' },
		photo: { type: String, default: '' },
		videolink: { type: String, default: '' },
		likes: { type: Number, default: 0, min: 0 },
		
	},
	{ timestamps: true }
);

module.exports = mongoose.model('recipe', recipeSchema);

