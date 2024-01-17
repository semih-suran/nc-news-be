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
      return supertest(app)
        .get("/api/articles/888")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article Not Found");
        });
    });
    test("should return a Status Code: 400 if passed article ID is not a number", () => {
      return supertest(app)
        .get("/api/articles/semih8")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid article_id Format. Must Be a Number."
          );
        });
    });
    test("should return an article with the correct structure", () => {
      return supertest(app)
        .get("/api/articles/8")
        .expect(200)
        .then((response) => {
          const article = response.body;
          expect(article.article_id).toBe(8);
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
  describe("GET Articles in Descending Order by Date", () => {
    test("should return all articles in descending order", () => {
      return supertest(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("should NOT have (body) property but should have the correct structure", () => {
      return supertest(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body;
          expect(articles.length > 0).toBe(true);
          articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
  });
  describe("GET Comments By Article ID", () => {
    test("should return all comments for a specific article_id", () => {
      return supertest(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body;
          expect(comments.length > 0).toBe(true);
          expect(Array.isArray(comments)).toBe(true);
        });
    });
    test("should return a Status Code: 404 for a non-existent article ID ", () => {
      return supertest(app)
        .get("/api/articles/888/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "No Comments Found For This Article..."
          );
        });
    });
    test("should return a Status Code: 400 if passed article ID is not a number", () => {
      return supertest(app)
        .get("/api/articles/semih/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid article_id Format. Must Be a Number."
          );
        });
    });
  });
});
