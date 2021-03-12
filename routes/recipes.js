const express = require('express');
const _ = require('lodash');
const router = express.Router();
// Models
const { Recipe, validate } = require('../models/recipe');
const { User } = require('../models/user');
// Middlewares
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all recipe
// Everyone can get it.
router.get('/', async (req, res) => {
    const recipes = await Recipe.find().sort('name');
    res.send(recipes);
});

// Post a new recipe
// Every authenticated user can post a recipe
router.post('/create', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    recipe = new Recipe(_.pick(req.body, ['name', 'ingredients', 'instructions', 'image', 'categories']));

    // Author is the user that is creating the recipe.
    recipe.author = req.user._id;

    await recipe.save();
    res.status(200).send(_.pick(recipe, ['_id', 'name', 'author', 'ingredients', 'instructions', 'image', 'categories']));
})

// Update recipe
// only owner
router.put('/', auth, async (req, res) => {
    recipeId = _.pick(req.body, ['_id']);
    if (!recipeId) return res.status(400).send('Got no recipe ID to update.');

    let recipe = await Recipe.findOne({ _id: recipeId });
    if (!recipe) return res.status(400).send('Recipe does not exist.');

    // If this isn't this user's recipe, return denied.
    if (recipe.author != req.user._id) return res.status(403).send('No access to this resource.');

    let { name, ingredients, instructions, image, categories } = _.pick(req.body, ['name', 'ingredients', 'instructions', 'image', 'categories']);

    await Recipe.updateOne({ _id: recipeId }, {
        name: name,
        ingredients: ingredients,
        instructions: instructions,
        image: image,
        categories: categories
    }, { omitUndefined: true });

    recipe = await Recipe.findOne({ _id: recipeId });

    res.status(200).send(_.pick(recipe, ['_id', 'name', 'ingredients', 'instructions', 'image', 'categories']));
});

// Delete a recipe
// Only the owner
router.delete('/', auth, async (req, res) => {
    recipeId = _.pick(req.body, ['_id']);
    if (!recipeId) return res.status(400).send('Got no recipe ID to delete.');

    let recipe = await Recipe.findOne({ _id: recipeId });
    if (!recipe) return res.status(400).send('Recipe does not exist.');

    // If this isn't this user's recipe, return denied.
    if (recipe.author != req.user._id) return res.status(403).send('No access to this resource.');

    await Recipe.deleteOne({ _id: recipeId });
    res.send(recipe);
});

module.exports = router;