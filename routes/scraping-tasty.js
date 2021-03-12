// Tasty API - https://rapidapi.com/apidojo/api/tasty
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const unirest = require("unirest");
// Middlewares
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const headers = {
    "x-rapidapi-key": "c527f4710emsh86d243f83c2fa3bp13c91djsn901f8148217e",
    "x-rapidapi-host": "tasty.p.rapidapi.com",
    "useQueryString": true
};

querySize = "20";

// Get all tags
// Everyone can get it.
router.get('/tags', async (req, res) => {
    
    const tastyReq = unirest("GET", "https://tasty.p.rapidapi.com/tags/list");
    tastyReq.headers(headers);
    tastyReq.end(function (tastyRes) {
        if (tastyRes.error) throw new Error(tastyRes.error);

        const tags = tastyRes.body.results;

        res.send(tags);
    });
});

// Get all recipes of a specific tag
// Everyone can get it.
router.get('/recipes/tags/:tag', async (req, res) => {
    
    const tastyReq = unirest("GET", "https://tasty.p.rapidapi.com/recipes/list");
    tastyReq.query({
        "from": "0",
        "size": querySize,
        "tags": req.params.tag
    });
    tastyReq.headers(headers);
    tastyReq.end(function (tastyRes) {
        if (tastyRes.error) throw new Error(tastyRes.error);

        const recipes = tastyRes.body.results;

        recipes.forEach(element => {
            console.log(element.name);
            console.log(element.thumbnail_url); //image
            console.log(element.tags); // Categories
            console.log(element.instructions);
        });

        res.send(recipes);
    });
});

module.exports = router;