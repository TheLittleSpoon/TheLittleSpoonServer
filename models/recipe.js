const mongoose = require("mongoose");
const Joi = require('joi');

// This is an hepler schema to make the Recipe scheme more readable.
var ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    validate: {
      validator: function (quantity) {
        return quantity && quantity > 0;
      },
      message: "Quantity must be larger than 0.",
    },
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

// Recipe model + schema
const Recipe = mongoose.model(
  "Recipe",
  new mongoose.Schema({
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      lowercase: true,
      trim: true,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true
    },
    ingredients: {
      type: [ingredientSchema],
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }
  })
);

// Recipe validation.
function validateRecipe(recipe) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    // Author is not needed because no api uses it
    // author: Joi.required(),
    ingredients: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().min(2).max(255).required(),
          quantity: Joi.number().required(),
          unit: Joi.string().required(),
        })
      )
      .required(),
    instructions: Joi.string(),
    imageUrl: Joi.string().required(),
    categories: Joi.objectId().required()
  });

  return schema.validate(recipe);
}

// Exports
module.exports.Recipe = Recipe;
module.exports.validate = validateRecipe;
