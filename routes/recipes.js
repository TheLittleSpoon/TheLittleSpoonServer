// Express
const express = require('express');
const { Recipe } = require('../models/recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all recipe
// Everyone can get it.
router.get('/', async (req, res) => {

    res.send(await Recipe.find());
})

module.exports = router;