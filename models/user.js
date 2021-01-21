const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        minlength: 2,
        maxlength: 50,
        required: true
    },
    email: { 
        type: String, 
        minlength: 5,
        maxlength: 255,
        required: true,
        uniqe: true
    },
    password: { 
        type: String, 
        minlength: 5,
        maxlength: 1024,
        required: true
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

// User model + schema
const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(user);
}

// Exports
module.exports.User = User;
module.exports.validate = validateUser;