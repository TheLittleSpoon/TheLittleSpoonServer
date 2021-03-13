const mongoose = require("mongoose");
const Joi = require('joi');

// Category model + schema
const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      lowercase: true,
      trim: true,
      required: true,
    }
  })
);

// Recipe validation.
function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required()
  });

  return schema.validate(category);
}

// Exports
module.exports.Category = Category;
module.exports.validate = validateCategory;