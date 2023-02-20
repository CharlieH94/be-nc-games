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

    describe.only('GET /api/reviews/:review_id', () => {
        
        xit('200: responds with a review object', () => {
            return request(app)
                .get('/api/reviews/:review_id')
                .expect(200)
                .then(({ body }) => {
                    const { review } = body;
                    expect(review.length).toBe(1);
                    expect(review[0]).toHaveProperty('review_id', expect.any(Number))
                    expect(review[0]).toHaveProperty('title', expect.any(String))
                    expect(review[0]).toHaveProperty('review_body', expect.any(String))
                    expect(review[0]).toHaveProperty('designer', expect.any(String))
                    expect(review[0]).toHaveProperty('review_img_url', expect.any(String))
                    expect(review[0]).toHaveProperty('votes', expect.any(Number))
                    expect(review[0]).toHaveProperty('category', expect.any(String))
                    expect(review[0]).toHaveProperty('owner', expect.any(String))
                    expect(review[0]).toHaveProperty('created_at', expect.any(String))
            })
        });

        xit('400: Bad Request', () => {
            // /dog
        });

        xit('404: Not Found', () => {
            // /9999999
        });

    });
    
});