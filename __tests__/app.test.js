const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => db.end());

describe("app", () => {
  describe("GET /api/categories", () => {
    test("200: Responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories.length).toBe(4);
          categories.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });

  describe("GET /api/reviews", () => {
    it("200: responds with array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews.length).toBe(13);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));
          });
          expect(reviews[4].comment_count).toBe(3);
        });
    });

    it("200: response sorted by date descending", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });

  describe("GET /api/reviews/:review_id", () => {
    it("200: responds with a review object", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            votes: 1,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          });
        });
    });
    it("400: invalid review_id parametric endpoint", () => {
      return request(app)
        .get("/api/reviews/i-am-groot")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });

    it("404: responds with correct message for non-existent review_id", () => {
      return request(app)
        .get("/api/reviews/9999999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not Found");
        });
    });
  });

  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: responds with an array of comments for given review_id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(3);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            });
          });
        });
    });
    it("200: response sorted by date descending", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("200: responds with an empty array for a review_id with no comments", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toEqual([]);
          });
    });
    it("400: invalid review_id parametric endpoint", () => {
        return request(app)
          .get("/api/reviews/i-am-groot/comments")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad Request");
          });
      });
  
      it("404: responds with correct message for non-existent review_id", () => {
        return request(app)
          .get("/api/reviews/9999999/comments")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not Found");
          });
      });
  });

  describe("POST /api/reviews/:review_id/comments", () => {
    it("201: responds with posted comment", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "philippaclaire9",
          body: "I am Groot",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 7,
            body: "I am Groot",
            review_id: 1,
            author: "philippaclaire9",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    it("400: bad request if invalid request body (eg username wrong data type)", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: 117,
          body: "I am Groot",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it('400: request body not containing required body', () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: 'philippaclaire9'
        })
        .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing Required Properties");
      })
    });
    it('400: request body not containing required username', () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          body: 'I am Groot'
        })
        .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing Required Properties");
      })
    });
  });

  describe("error handling", () => {
    it("404: responds with correct message for non-existent path", () => {
      return request(app)
        .get("/api/i-am-groot")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Path Not Found");
        });
    });
  });
});
