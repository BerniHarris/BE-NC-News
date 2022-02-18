const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

// ---- connect and disconnect for each test ----
beforeEach(() => {
  return seed(testData) 
})

afterAll(() => {
  return db.end(); 
});


describe('TOPICS', () => {
  // ---- GETS ----
  describe('GET /api/topics', () => {
    test('status 200: returns an array of topic objects with a key of slug and description', () => {
       return request(app)
       .get("/api/topics")
       .expect(200)
       .then((res) => {
        expect(res.body.topics.length).toBe(3); 
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })) 
        } )   
       })
    })
  });
// ---- ERRORS ----
describe('ERRORS /api/topics', () => {
  test(`status: 404 - returns a path not found message if topic doesn't exist`, () => {
    return request(app)
      .get('/api/jibberish')
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe('Path not found.');
      });
  });
});
});


describe('ARTICLE_ID', () => {
  // ---- GETS ----
  describe('GET /api/articles/:article_id', () => {
    test('status 200: returns an article object with specified properties', () => {
      return request(app)
      .get('/api/articles/1') // ---- as askng for article 1, results should match 1 
      .expect(200)
      .then(({body: {article}}) => {
          expect(article).toBeInstanceOf(Object)
          expect(article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
              })
          )
      })
  });
  // ---- ERRORS ----
});
describe('ERRORS: /api/articles/:article_id', () => {
  test(`status: 404 - returns a path not found message if article id doesn't exist`, () => {
    return request(app)
      .get('/api/articles/15')
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe(`Article id not found. Please check and try again :)`);
      });
  });
  test(`status: 400 - returns invalid error message if id is not input as a number`, () => {
    return request(app)
      .get('/api/articles/notanumber')
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Not a valid article id. Please check your id number and try again');
      });
  });
});
});
