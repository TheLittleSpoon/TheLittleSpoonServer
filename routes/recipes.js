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
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    recipe = new Recipe(_.pick(req.body, ['name', 'ingredients', 'instructions']));

    // Get the user's name:
    const author = await User.findById(req.user._id).select('name');
    // recipe.author = author.name; // Gets the name of the author withour ID
    recipe.author = author;

    await recipe.save();
    res.send(_.pick(recipe, ['_id', 'name', 'author', 'ingredients', 'instructions']));
})

// Delete a recipe
// Only an admin - Maybe the owner ?
router.delete('/', [ auth, admin ], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let recipe = await Recipe.findOne({ _id: req.body._id });
    if (!recipe) return res.status(400).send('Recipe does not exist.');

    await Recipe.deleteOne({ _id: req.body._id });
    res.send(recipe)
});

module.exports = router;