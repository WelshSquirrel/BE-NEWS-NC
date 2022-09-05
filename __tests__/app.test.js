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
    it('should return a 400 with a bad request if the id is invalid', () => {
        return request(app)
        .get(`/api/articles/bad`)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'bad request'})
        })
    })
    it('should return a 404 not found when given a valid number id that does not exist', () => {
        return request(app)
        .get(`/api/articles/153`)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'article ID not found'})
        })
    })
})

describe('GET /api/users', () => {
    it('should return an array of users with the correct properties ', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const { users } = body
            expect(Array.isArray(users)).toBe(true)
            expect(users.length).toBe(4)
            users.forEach((users) => {
                expect(users).toHaveProperty('username', expect.any(String))
                expect(users).toHaveProperty('name', expect.any(String))
                expect(users).toHaveProperty('avatar_url', expect.any(String))
            })
        })
    })
})
