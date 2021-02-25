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

    recipe = new Recipe(_.pick(req.body, ['name', 'ingredients', 'instructions', 'image']));

    // Get the user from the database (we need his name):
    const author = await User.findById(req.user._id).select('name');
    //if(!author) return res.status(400).send('Author does not exist.');
    // recipe.author = author.name; // Gets the name of the author withour ID
    recipe.author = author;

    await recipe.save();
    res.status(200).send(_.pick(recipe, ['_id', 'name', 'author', 'ingredients', 'instructions', 'image']));
})

// Delete a recipe
// Only an admin - Maybe the owner ?
router.delete('/', auth, async (req, res) => {
    recipeId = _.pick(req.body, ['_id']);
    if (!recipeId) return res.status(400).send('Got no recipe ID to delete.');

    let recipe = await Recipe.findOne({ _id: recipeId });
    if (!recipe) return res.status(400).send('Recipe does not exist.');

    await Recipe.deleteOne({ _id: req.body._id });
    res.send(recipe)
});

module.exports = router;