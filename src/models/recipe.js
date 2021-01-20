const mongoose = require('mongoose'); 

// Recipe schema
const recipeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        maxlength: 255,
        lowercase: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Burgers', 'Asian', 'Italian']
    },
    author: { type: String, default: "Gordon Ramsay"},
    ingredients: { type:[ String ], required: true},
    description: { 
        type: String, 
        required: true,
        validate: {
            validator: function(text) {
                return text && text.length > 20;
            },
            message: 'A recipe should have at least 20 letters on its description.'
        }
    }
});

// Recipe model
const Recipe = mongoose.model('Recipe', recipeSchema);

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