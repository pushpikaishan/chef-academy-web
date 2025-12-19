const mongoose = require('mongoose');
const { Schema } = mongoose;

const toolSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		photo: { type: String, default: '' },
		description: { type: String, default: '' },
		department: { type: String, default: '' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('tool', toolSchema);

