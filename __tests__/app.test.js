const supertest = require("supertest");
const fs = require("fs");
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
    test("should return a Status Code : 200", () => {
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
    test("should return a Status Code : 404 when invalid", () => {
      return supertest(app).get("/api/meow").expect(404);
    });
  });
  describe("GET ALL Endpoints", () => {
    test("should return a Status Code : 200", () => {
      return supertest(app).get("/api/endpoints").expect(200);
    });
    test("should return a non-empty object", () => {
      return supertest(app)
        .get("/api/endpoints")
        .then((response) => {
          expect(response.body).toBeInstanceOf(Object);
          expect(Object.keys(response.body).length).toBeGreaterThan(0);
        });
    });
    test("should include a specific endpoint", () => {
      return supertest(app)
        .get("/api/endpoints")
        .then((response) => {
          expect(response.body).toHaveProperty("GET /api/articles");
        });
    });
    test("should match received endpoints with endpoints.json", () => {
      const endpointsPath = "./endpoints.json";
      const expectedEndpoints = JSON.parse(
        fs.readFileSync(endpointsPath, "utf-8")
      );
      return supertest(app)
        .get("/api/endpoints")
        .then((response) => {
          expect(response.body).toEqual(expectedEndpoints);
        });
    });
  });
  describe("GET Articles by ID", () => {
    test("should return a Status Code: 200 for a successful request", () => {
      return supertest(app).get("/api/articles/5").expect(200);
    });
    test("should return a Status Code: 404 for a non-existent article ID", () => {
      return supertest(app).get("/api/articles/888").expect(404);
    });    
    test("should return a Status Code: 400 if passed article ID is not a number", () => {
      return supertest(app).get("/api/articles/semih8").expect(400);
    });
    test("should return an article with the Correct Keys In", () => {
      return supertest(app)
        .get("/api/articles/8")
        .expect(200)
        .then((response) => {
          const article = response.body.article[0];
          console.log(article)
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });
  });
});
