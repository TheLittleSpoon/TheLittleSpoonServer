// Tasty API - https://rapidapi.com/apidojo/api/tasty
const unirest = require("unirest");
const _ = require('lodash');

const headers = {
    "x-rapidapi-key": "c527f4710emsh86d243f83c2fa3bp13c91djsn901f8148217e",
    "x-rapidapi-host": "tasty.p.rapidapi.com",
    "useQueryString": true
};

tastyTag = "under_30_minutes";
querySize = "20";

function listTags() {
    const req = unirest("GET", "https://tasty.p.rapidapi.com/tags/list");

    req.headers(headers);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        console.log(res.body);
    });
}

function listRecipes() {
    const req = unirest("GET", "https://tasty.p.rapidapi.com/recipes/list");

    req.query({
        "from": "0",
        "size": querySize,
        "tags": tastyTag
    });

    req.headers(headers);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        console.log(_.pick(res.body, ['count']));
    });
}

listTags();