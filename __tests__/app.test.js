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
            .then(({
                body
            }) => {
                const {
                    topics
                } = body
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
            .then(({
                body
            }) => {
                expect(body.article).toMatchObject({
                    article_id: 4,
                    title: "Student SUES Mitch!",
                    topic: "mitch",
                    author: "rogersop",
                    body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                    created_at: expect.any(String),
                    votes: 0,
                })
            })
    })
    it('should return a 400 with a bad request if the id is invalid', () => {
        return request(app)
            .get(`/api/articles/bad`)
            .expect(400)
            .then(({
                body
            }) => {
                expect(body).toEqual({
                    msg: 'bad request'
                })
            })
    })
    it('should return a 404 not found when given a valid number id that does not exist', () => {
        return request(app)
            .get(`/api/articles/153`)
            .expect(404)
            .then(({
                body
            }) => {
                expect(body).toEqual({
                    msg: 'article ID not found'
                })
            })
    })
    it('should return an updated object with a comment count and the correct amount of comments', () => {
        return request(app)
            .get(`/api/articles/5`)
            .expect(200)
            .then(({
                body
            }) => {
                expect(body.article).toMatchObject({
                    title: "UNCOVERED: catspiracy to bring down democracy",
                    topic: "cats",
                    author: "rogersop",
                    body: "Bastet walks amongst us, and the cats are taking arms!",
                    created_at: expect.any(String),
                    votes: 0,
                    comment_count: 2
                })
            })
    })
})

describe('GET /api/users', () => {
    it('should return an array of users with the correct properties ', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({
                body
            }) => {
                const {
                    users
                } = body
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

describe('PATCH /api/articles', () => {
    it('should return the object with an updated vote count by the specified amount', () => {
        const updatedVote = {
            inc_votes: 50
        }
        return request(app)
            .patch(`/api/articles/4`)
            .send(updatedVote)
            .expect(200)
            .then(({
                body
            }) => {
                expect(body.article).toEqual({
                    article_id: 4,
                    title: "Student SUES Mitch!",
                    topic: "mitch",
                    author: "rogersop",
                    body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                    created_at: expect.any(String),
                    votes: 50,
                })
            })
    })
    it('should return a 400 bad request if the votes are invalid such as not a number', () => {
        const updatedVote = {
            inc_votes: 'five'
        }
        return request(app)
            .patch(`/api/articles/4`)
            .send(updatedVote)
            .expect(400)
            .then(({
                body
            }) => {
                expect(body).toEqual({
                    msg: 'bad request'
                })
            })
    })
    it('should return a 404 route not found when given a valid id that does not exist', () => {
        const updatedVote = {
            inc_votes: 50
        }
        return request(app)
            .patch(`/api/articles/567`)
            .send(updatedVote)
            .expect(404)
            .then(({
                body
            }) => {
                expect(body).toEqual({
                    msg: 'article ID not found'
                })
            })
    })
    it('should return a 400 route not found when given an invalid id', () => {
        const updatedVote = {
            inc_votes: 50
        }
        return request(app)
            .patch(`/api/articles/bad`)
            .send(updatedVote)
            .expect(400)
            .then(({
                body
            }) => {
                expect(body).toEqual({
                    msg: 'bad request'
                })
            })
    })
    it('should return a 400 bad request if votes are empty or invalid ', () => {
        const updatedVote = {}
        return request(app).patch(`/api/articles/4`)
            .send(updatedVote)
            .expect(400)
            .then(({
                body
            }) => {
                expect(body).toEqual({
                    msg: "bad request"
                })
            })
    });
})

describe('GET /api/articles/:article_id/comments', () => {
    it('should return an array of topics with the properties slug and description', () => {
        return request(app)
            .get('/api/articles/5/comments')
            .expect(200)
            .then(({
                body
            }) => {
                const {
                    comments
                } = body
                expect(comments.length).toBe(2)
                expect(comments).toEqual(
                    [{
                            comment_id: 14,
                            body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
                            votes: 16,
                            author: "icellusedkars",
                            article_id: 5,
                            created_at: expect.any(String),
                        },
                        {
                            comment_id: 15,
                            body: "I am 100% sure that we're not completely sure.",
                            votes: 1,
                            author: "butter_bridge",
                            article_id: 5,
                            created_at: expect.any(String),
                        }
                    ])
            })

    })
    it('returns an empty array when the specific id has no comments', () => {
        return request(app).get(`/api/articles/7/comments`)
            .expect(200)
            .then(({
                body
            }) => {
                const {
                    comments
                } = body
                expect(comments).toEqual([])
            })
    });
    it('should return a 400 if the id is invalid ', () => {
        return request(app)
            .get(`/api/articles/bad/comments`)
            .expect(400)
            .then(({
                body
            }) => {
                expect(
                    body
                ).toEqual({
                    msg: 'bad request'
                })
            })
    })
    it('returns 404 route not found when passed a valid ID that does not exist', () => {
        return request(app).get(`/api/articles/476/comments`)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Route not found'})
        })
    });
})


