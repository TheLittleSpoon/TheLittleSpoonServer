const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

// User schema.
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
    },
    isAdmin: {
        type: Boolean,
        default: false
        // required: true
    }
});

// Generate token for each new connected user.
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

// User model
const User = mongoose.model('User', userSchema);

// User validation.
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
        // isAdmin: Joi.required()
    });

    return schema.validate(user);
}

// Exports
module.exports.User = User;
module.exports.validate = validateUser;