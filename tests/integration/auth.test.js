/**
 * @jest-environment node
 */
const request = require('supertest');
const { User } = require('../../models/user');
const { Recipe } = require('../../models/recipe');
let server;

describe('auth middleware', () => {

    beforeEach(() => server = require('../../server'));
    afterEach(async () => { 
        await Recipe.deleteMany({});
        server.close();
    });

    let token = '';

    const exec = () => {
        return request(server)
            .post('/api/recipes')
            .set('x-auth-token', token)
            .send({
                "name": "recipe",
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
        });
    };

    beforeEach(async () => {
        token = new User(await User.collection.findOne({ name: "itamar marom" })).generateAuthToken();
    });

    it('should return 401 if client is not loggen in.', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if the token is invalid.', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if the token is valid.', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});