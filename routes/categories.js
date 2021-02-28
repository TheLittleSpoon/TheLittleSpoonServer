const express = require('express');
const _ = require('lodash');
const router = express.Router();
// Models
const { Category, validate } = require('../models/category');
const { User } = require('../models/user');
// Middlewares
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all categories
// Everyone can get it.
router.get('/', async (req, res) => {
    const categories = await Category.find().sort('name');
    res.send(categories);
});

// Create a new category
// Every admin can do it.
router.post('/', [ auth, admin ], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    category = new Category(_.pick(req.body, 'name'));

    await category.save();
    res.status(200).send(_.pick(category, ['_id', 'name']));
})

// Delete a category
// Only an admin can delete a category
router.delete('/', [auth, admin], async (req, res) => {
    categoryId = _.pick(req.body, ['_id']);
    if (!categoryId) return res.status(400).send('Got no category ID to delete.');

    let category = await Category.findOne({ _id: categoryId });
    if (!category) return res.status(400).send('Category does not exist.');

    await Category.deleteOne({ _id: req.body._id });
    res.send(category)
});

module.exports = router;