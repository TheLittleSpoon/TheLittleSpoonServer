const mongoose = require('mongoose'); 
const Joi = require('joi');

ingredientSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number,
        validate: {
            validator: function(quantity) {
                return quantity && quantity > 0;
            },
            message: 'Quantity must be larger than 0.'
        },
        required: true
    },
    measuringUnit: {
        type: String,
        enum: ['g', 'Kg', 'ml', 'L'],
        required: true
    }
});

// Recipe model + schema
const Recipe = mongoose.model('Recipe', new mongoose.Schema({
    name: { 
        type: String, 
        maxlength: 255,
        lowercase: true,
        trim: true,
        required: true
    },
    author: { 
        type: String, 
        required: true
    },
    ingredients: { 
        type:[ ingredientSchema ], 
        required: true
    },
    instructions: { 
        type: [ String ], 
        required: true
    }
}));

function validateRecipe(recipe) {
    const schema = {
        name: Joi.string().required(),
        author: Joi.string().required(),
    };

    return Joi.validate(recipe, schema);
}

// Not finished - only games
async function createRecipe() {
    const recipe = new Recipe({
        // name: 'Cake',
        ingredients: ['chocholate', 'eggs'],
        description: 'Make a cake'
    });
    
    try {
        const result = await recipe.save();
        console.log(result);    
    } 
    catch (e) {
        for (field in e.errors)
            dbDubug('Error: ', e.errors[field].message);
    }
    
}

// Not finished - only games
async function getRecipes() {
    const recipes = await Recipe
        .find()
        .or([ {author: 'Gordon Ramsay'}, {name: /^Cake/}])
        .and([ {name: "Cake"}])
        .limit(1)
        .sort({ name: 1 })
        .select({ name: 1, ingredients: 1 })
        .countDocuments();
    console.log(recipes);
};

// Exports
module.exports.Recipe = Recipe;
module.exports.getRecipes = getRecipes;
module.exports.createRecipe = createRecipe;