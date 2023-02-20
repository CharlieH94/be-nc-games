const { categoryData, commentData, reviewData, userData } = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');
const request = require('supertest');
const { seed } = require('../db/seeds/seed');
const app = require('../app.js');

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => db.end());

xdescribe('Name of the group', () => {
    it('should ', () => {
        
    });
});