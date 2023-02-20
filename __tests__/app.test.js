const { categoryData, commentData, reviewData, userData } = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');
const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const app = require('../app.js');

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => db.end());

describe('app', () => {

    describe('GET /api/categories', () => {
        
        test('200: Responds with an array of category objects', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({ body }) => {
                    const { categories } = body;
                    expect(categories.length).toBe(4);
                    categories.forEach(category => {
                        expect(category).toHaveProperty('slug', expect.any(String));
                        expect(category).toHaveProperty('description', expect.any(String));
                    });
                });
        });

    });

    
});