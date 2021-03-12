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
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRiYzYyMzVkODZhNWI3MjE4YjU3Y2QiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2MTU1Nzk5OTV9.1AdL-vvlCcNW-rviR3smc2s6F25iTbdIMYGikJd3kt0";

function createRecipes(tag) {
    const req = unirest("GET", `http://localhost:3000/api/tasty/recipes/tags/${tag}`);
    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        // Foreach recipe
        res.body.forEach(async (element) => {
            try {
                let category = await Category.findOne({ name: element.categories }).select("_id");
                // let { categoryId } = category._id;
                // console.log("name: " + element.name);
                // console.log("image: "+ element.image);
                // console.log("instructions: "+ element.instructions);
                const recipesReq = unirest("POST", `http://localhost:3000/api/recipes/create`);
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
            const tagsReq = unirest("POST", `http://localhost:3000/api/categories`);
            tagsReq.headers({
                "x-auth-token": token
            });
            tagsReq.type('json').send({
                "name": element,
                "imageUrl": "imageurl"
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

createCategories();
// createRecipes(tag);
// mongoose.connection.close();