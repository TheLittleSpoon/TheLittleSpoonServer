const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Recipe} = require('../models/recipe');
const router = express.Router();

// Get my details.
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// Get all users:
// Only Admin can get all the users.
router.get('/', [auth, admin], async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

// Create a new user:
// Anyone can create a user.
router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send(_.pick(user, ['_id', 'name', 'email']));
});

// Update user
// only owner
router.put('/', auth, async (req, res) => {
    userId = _.pick(req.body, ['_id']);
    if (!userId) return res.status(400).send('Got no user ID to update.');

    if ((req.user._id != userId) && (!req.user.isAdmin)) return res.status(403).send('No access to this resource.');

    let user = await User.findOne({_id: userId});
    if (!user) return res.status(400).send('User does not exist.');

    let {name, password} = _.pick(req.body, ['name', 'password']);
    const salt = await bcrypt.genSalt(10);
    const finalPass = await bcrypt.hash(password, salt);

    await User.updateOne({_id: userId}, {
        name: name,
        password: finalPass
    }, {omitUndefined: true});

    user = await User.findOne({_id: userId});

    res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
});

// Delete a category
// Only an admin can delete a user
router.delete('/:id', auth, async (req, res) => {
    if ((req.user._id != req.params.id) && (!req.user.isAdmin)) return res.status(403).send('No access to this resource.');

    let user = await User.findOne({_id: req.params.id});
    if (!user) return res.status(400).send('User does not exist.');

    await User.deleteOne({_id: req.params.id});
    res.send(user)
});

// Special Query
router.post('/byFilter', [auth, admin], async (req, res) => {
    let {name, recipeNumber, isAdmin} = _.pick(req.body, ['name', 'recipeNumber', 'isAdmin']);

    let query = [];

    if (name && (name != "")) query.push({"name": {$regex: name}});
    if (isAdmin) query.push({isAdmin: isAdmin});
    let users = [];
    if (query.length !== 0) {
        users = await User.find({$and: query});
    } else {
        users = await User.find();
    }
    let finalUsers = [];


    if(parseInt(recipeNumber) < 0) {
        res.send(users);
        return;
    }
    const o = {};
    o.map = 'function () { emit(this.author, this._id) }';
    o.reduce = 'function (k, vals) { return vals.length }';

    let wait = await Recipe.mapReduce(o, (err, model, stats) => {
        model.results.forEach(value => {
            if (value.value > parseInt(recipeNumber)) {
                users.filter(value1 => value1._id.toString() === value._id.toString()).forEach(value1 => finalUsers.push(value1))
                res.send(finalUsers);
            }
        })
    })
});

module.exports = router;
