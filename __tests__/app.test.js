const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require('../app');

beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
   return db.end()
});

describe('GET /api/topics', () => {
    it('should return an array of topics with the properties slug and description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const { topics } = body
            expect(Array.isArray(topics)).toBe(true)
            expect(topics.length).toBe(3)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('description', expect.any(String))
                expect(topic).toHaveProperty('slug', expect.any(String))
            })
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    it('returns an article object with the correct properties', () => {
        return request(app)
        .get(`/api/articles/4`)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject(
                {
                    article_id: 4,
                    title: "Student SUES Mitch!",
                    topic: "mitch",
                    author: "rogersop",
                    body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                    created_at: expect.any(String),
                    votes: 0,
                  }
                )
        })
    })
})