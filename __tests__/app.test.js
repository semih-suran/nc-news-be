const supertest = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("Set of GET Tests", () => {
  describe("GET ALL topics", () => {
    test("should return a status code : 200", () => {
      return supertest(app).get("/api/topics").expect(200);
    });
    test("should return an array of topics", () => {
      return supertest(app)
        .get("/api/topics")
        .then((response) => {
          expect(response.body.topics).toBeInstanceOf(Array);
        });
    });
    test("should have all 3 topics", () => {
      return supertest(app)
        .get("/api/topics")
        .then((response) => {
          expect(response.body.topics.length).toBe(3);
        });
    });
    test("should return a status code : 404 when invalid", () => {
      return supertest(app).get("/api/meow").expect(404);
    });
  });
  describe("GET ALL Endpoints", () => {
    test("should return a status code : 200", () => {
      return supertest(app).get("/api/endpoints").expect(200);
    });
    test("should return an object of all endpoints", () => {
      return supertest(app)
        .get("/api/endpoints")
        .then((response) => {
          expect(response.body).toBeInstanceOf(Object);
        });
    });
    test("should include a specific endpoint", () => {
      return supertest(app)
        .get("/api/endpoints")
        .then((response) => {
          expect(response.body).toHaveProperty("GET /api/articles");
        });
    });
    test("should include description key for each endpoint", () => {
      return supertest(app)
        .get("/api/endpoints")
        .then((response) => {
          const endpoints = response.body;
          Object.keys(endpoints).forEach((endpoint) => {
            expect(endpoints[endpoint]).toHaveProperty("description");
          });
        });
    });
  });
});
