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
});
