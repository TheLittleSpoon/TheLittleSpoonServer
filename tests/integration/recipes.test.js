/**
 * @jest-environment node
 */
const request = require('supertest');
const { Recipe } = require('../../models/recipe');
const { User } = require('../../models/user');
let server;

describe('/api/recipes', () => {
    beforeEach(() => server = require('../../server'));
    afterEach(async () => {
        await Recipe.deleteMany({});
        server.close();
    });

    describe('GET /', () => {
        it('should return all recipes.', async () => {
            await Recipe.collection.insertMany([
                {
                    "name": "recipe1",
                    "ingredients": [
                        {
                            "name": "ing1",
                            "quantity": "1",
                            "unit": "Kg"
                        },
                        {
                            "name": "ing2",
                            "quantity": "10",
                            "unit": "L"
                        }
                    ],
                    "instructions": "step a"
                },
                {
                    "name": "recipe2",
                    "ingredients": [
                        {
                            "name": "ing1",
                            "quantity": "500",
                            "unit": "g"
                        }
                    ],
                    "instructions": "step a"
                }
            ]);

            const res = await request(server).get('/api/recipes');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(r => r.name === 'recipe1')).toBeTruthy();
            expect(res.body.some(r => r.name === 'recipe2')).toBeTruthy();
        });
    });

    describe('POST /', () => {

        let user = '';
        let token = '';
        let recipeName = '';

        const exec = () => {
            return request(server)
                .post('/api/recipes')
                .set('x-auth-token', token)
                .send({
                    "name": recipeName,
                    "ingredients": [
                        {
                            "name": "ing1",
                            "quantity": "1",
                            "unit": "Kg"
                        },
                        {
                            "name": "ing2",
                            "quantity": "10",
                            "unit": "L"
                        }
                    ],
                    "instructions": "step a"
                });
        };

        beforeEach(async () => {
            user = new User(await User.collection.findOne({ name: "itamar marom" }));
            token = user.generateAuthToken();
            recipeName = 'recipe1';
        });

        it('should return 401 if client is not loggen in.', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if the name is more than 255 characters.', async () => {
            recipeName = new Array(300).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 200', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should save the recipe if it is valid', async () => {
            const res = await exec();
            const recipe = await Recipe.find({ _id: res._id });
            expect(recipe).not.toBeNull();
        });

        it('should return the recipe if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'recipe1');
        });
    });
});