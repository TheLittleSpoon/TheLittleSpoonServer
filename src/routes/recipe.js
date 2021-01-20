// Express
const express = require('express');
const { Recipe } = require('../models/recipe');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await Recipe.find());
})

module.exports = router;