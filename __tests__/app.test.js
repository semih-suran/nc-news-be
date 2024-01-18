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

describe("GET Tests", () => {
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
          expect(articles.length === 13).toBe(true);
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
    test("should return all comments for a specific article_id with correct structure", () => {
      return supertest(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body;
          expect(comments.length === 2).toBe(true);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
          });
        });
    });
    test("should return a Status Code: 400 for a non-existent article ID ", () => {
      return supertest(app)
        .get("/api/articles/888/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Non-existent Article ID");
        });
    });
    test("should return a Status Code: 404 for an article ID with no comments yet", () => {
      return supertest(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "No Comments Found For This Article ID..."
          );
        });
    });
    test("should return a Status Code: 400 if passed article ID is not a number", () => {
      return supertest(app)
        .get("/api/articles/semih5/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid article_id Format. Must Be a Number."
          );
        });
    });
  });
});
describe("POST Tests", () => {
  describe("POST Comments By Article ID", () => {
    test("should return a Status Code: 201 and add a comment to the specified article", () => {
      const newComment = {
        username: "lurker",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/5/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const comment = response.body;
          console.log(comment);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
          expect(comment.author).toBe(newComment.username);
          expect(comment.body).toBe(newComment.body);
          expect(comment.article_id).toBe(5);
        });
    });
    test("should return a Status Code: 400 if (body) key is missing", () => {
      const userNameOnly = {
        username: "lurker",
      };
      return supertest(app)
        .post("/api/articles/1/comments")
        .send(userNameOnly)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "(username) and (body) are required fields."
          );
        });
    });
    test("should return a Status Code: 400 if (username) key is missing", () => {
      const bodyOnly = {
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/1/comments")
        .send(bodyOnly)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("(username) does not exist.");
        });
    });
    test("should return a Status Code: 404 if (username) key given but does not exist", () => {
      const invalidUsername = {
        username: "semih",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/1/comments")
        .send(invalidUsername)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("(username) does not exist.");
        });
    });
    test("should return a Status Code: 404 if the article ID does not exist", () => {
      const newComment = {
        username: "semih",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Non-existent Article ID");
        });
    });
    test("should return a Status Code: 400 if given article ID is not a number", () => {
      const newComment = {
        username: "semih",
        body: "This article is FAN TEST IC.",
      };
      return supertest(app)
        .post("/api/articles/semih8/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid article_id Format. Must Be a Number."
          );
        });
    });
  });
});
describe("PATCH Tests", () => {
  describe("PATCH Votes By Article ID", () => {
    test("should return a Status Code: 201 and add PATCH the specified article", () => {
      const newVote = {
        inc_votes: 18,
      };
      return supertest(app)
        .patch("/api/articles/5")
        .send(newVote)
        .expect(201)
        .then((response) => {
          const vote = response.body[0];
          expect(vote).toHaveProperty("title");
          expect(vote).toHaveProperty("topic");
          expect(vote).toHaveProperty("author");
          expect(vote).toHaveProperty("body");
          expect(vote).toHaveProperty("created_at");
          expect(vote).toHaveProperty("article_img_url");
          expect(vote.votes).toBe(18);
          expect(vote.article_id).toBe(5);
        });
    });
    test("should return a Status Code: 400 if there is no (inc_votes) key.", () => {
      const RandomInfo1 = {
        randomInfo:
          "Chocolate does not ask any questions. Chocolate simply understands.",
      };
      return supertest(app)
        .patch("/api/articles/5/")
        .send(RandomInfo1)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "(inc_votes) is required and should be the only key."
          );
        });
    });
    test("should return a Status Code: 400 if there are more keys with (inc_votes).", () => {
      const RandomInfo2 = {
        inc_votes: 7,
        randomInfo: "I did not fall down. I did attack the floor, though.",
      };
      return supertest(app)
        .patch("/api/articles/5/")
        .send(RandomInfo2)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "(inc_votes) is required and should be the only key."
          );
        });
    });
    test("should return a Status Code: 404 if the specified article ID does not exist", () => {
      const validValue = {
        inc_votes: 7,
      };
      return supertest(app)
        .patch("/api/articles/999/")
        .send(validValue)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Non-existent Article ID");
        });
    });
  });
});
