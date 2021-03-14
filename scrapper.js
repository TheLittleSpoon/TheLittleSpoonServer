const mongoose = require('mongoose');
const unirest = require("unirest");
require("./middleware/async")();
require("./startup/db")();
const { Category, validate } = require('./models/category');

// User's details
// email: tasty@gmail.com
// password: tastypassword

const server = "35.224.144.255"
const tag = "under_30_minutes";
const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRkZTFhN2Q0NzAxNzEzNWYwY2M0OTIiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2MTU3MTY4MzN9.xwJEo0ZowoVU6AU3HuaHUlUOAe-Upd9g2SB9n3ja8_c";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRkZTQyYWQ0NzAxNzlkZWEwY2M1N2IiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjE1NzE3NDM0fQ.9trTWFKWpxSGKlRUcGdx9lN0m4tmcpxJt4vMN-Td4jo";

function createRecipes(tag) {
    const req = unirest("GET", `http://${server}:3000/api/tasty/recipes/tags/${tag}`);
    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        // Foreach recipe
        res.body.forEach(async (element) => {
            try {
                let category = await Category.findOne({ name: element.categories }).select("_id");
                
                const recipesReq = unirest("POST", `http://${server}:3000/api/recipes/create`);
                recipesReq.headers({
                    "x-auth-token": token
                });
                recipesReq.type('json').send({
                    "name": element.name,
                    "ingredients": [],
                    "instructions": element.instructions,
                    "image": element.image,
                    "categories": category._id
                });
                recipesReq.end(function (recipesRes) {
                    if (recipesRes.error) throw new Error(recipesRes.error);
                    console.log(recipesRes.body);
                });
            }
            catch (e) {
                console.log("element: " + element.name + "\n Error: " + e);
            }
        });
    });
};

function createCategories() {
    const req = unirest("GET", `http://${server}:3000/api/tasty/tags`);
    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        res.body.forEach(element => {
            const tagsReq = unirest("POST", `http://${server}:3000/api/categories`);
            tagsReq.headers({
                "x-auth-token": adminToken
            });
            tagsReq.type('json').send({
                "name": element
            });
            // console.log(element);
            tagsReq.end(function (tagsRes) {
                if (tagsRes.error) throw new Error(tagsRes.error);
            });
        });
    });
}

function masterScrapper() {
    const req = unirest("GET", `http://${server}:3000/api/tasty/tags`);
    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        res.body.forEach(element => {
            createRecipes(element.name);
        });
    });
}

// createCategories();
// createRecipes("gluten_free");
// createRecipes("5_ingredients_or_less");
// createRecipes("brunch");
// createRecipes("steam");
// createRecipes("blender");
// createRecipes("microwave");
createRecipes("snacks");
// mongoose.connection.close();