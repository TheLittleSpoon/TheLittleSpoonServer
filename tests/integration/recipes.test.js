const { before } = require("lodash");

const request = require('supertest');
const { Recipe } = require('../../models/recipe');
let server;

describe('/api/recipes', () => {
    beforeEach(() => { server = require('../../server'); });
    afterEach(async () => { 
        server.close();
        await Recipe.remove({});
    });

    describe('GET /', () => {
        it('should return all recipes.', async () => {
            Recipe.collection.insertMany([
                {
                    "name": "recipe1",
                    "ingredients": [ 
                        {
                            "name": "ing1",
                            "quantity": "1",
                            "measuringUnit": "Kg"
                        },
                        {
                            "name": "ing2",
                            "quantity": "10",
                            "measuringUnit": "L"
                        }
                    ],
                    "instructions": [ "step a" ]
                },
                {
                    "name": "recipe2",
                    "ingredients": [ 
                        {
                            "name": "ing1",
                            "quantity": "500",
                            "measuringUnit": "g"
                        }
                    ],
                    "instructions": [ "step a", "step b" ]
                }
            ])

            const res = await request(server).get('/api/recipes');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(r => r.name === 'recipe1')).toBeTruthy();
            expect(res.body.some(r => r.name === 'recipe2')).toBeTruthy();
        });
    });
});