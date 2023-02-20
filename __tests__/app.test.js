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

    
    describe('GET /api/reviews', () => {
        
        it('200: responds with array of review objects', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body;
                    expect(reviews.length).toBe(13);
                    reviews.forEach(review => {
                        expect(review).toHaveProperty('owner', expect.any(String));
                        expect(review).toHaveProperty('title', expect.any(String));
                        expect(review).toHaveProperty('review_id', expect.any(Number));
                        expect(review).toHaveProperty('category', expect.any(String));
                        expect(review).toHaveProperty('review_img_url', expect.any(String));
                        expect(review).toHaveProperty('created_at', expect.any(String));
                        expect(review).toHaveProperty('votes', expect.any(Number));
                        expect(review).toHaveProperty('designer', expect.any(String));
                        expect(review).toHaveProperty('comment_count', expect.any(Number));
                    })
                    expect(reviews[4].comment_count).toBe(3);
            })

        });
        
        it('200: response sorted by date descending', () => {
            return request(app)
                .get('/api/reviews')
            .expect(200)
                .then(({ body }) => {
                    const { reviews } = body;
                    expect(reviews).toBeSortedBy('created_at', {
                        descending: true
                    });
            })
        });

    });

    xdescribe('error handling', () => {
        
        it.only('404: GET responds with correct message for valid but non-existent paths', () => {
            return request(app)
                .get('/api/bananas')
                .expect(200)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe('Not Found');
            })
        })        
    });

});