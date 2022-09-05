const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require('../app');

beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
    db.end()
});

describe()