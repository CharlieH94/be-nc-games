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

    describe('queries', () => {
      it ('200: responds with reviews in specified category', () => {
        return request(app)
        .get("/api/reviews?category=social deduction")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews.length).toBe(11);
          reviews.forEach((review) => {
            expect(review.category).toBe('social deduction');
          });
        });
      });
      it ('200: responds with reviews sorted by specified column', () => {
        return request(app)
        .get("/api/reviews?sort_by=review_id")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("review_id", {
            descending: true,
          });
        });
      });
      it ('200: responds with reviews order as specified', () => {
        return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
      });
      it ('200: responds with empty array for valid category with no reviews associated', () => {
        return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toEqual([]);
        });
      });
      it ('404: category not in database', () => {
        return request(app)
        .get("/api/reviews?category=bananas")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not Found");
        });
      });
      it ('400: invalid sort by query', () => {
        return request(app)
        .get("/api/reviews?sort_by=bananas")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Sort Query");
        });
      });
      it ('400: invalid order query', () => {
        return request(app)
        .get("/api/reviews?order=bananas")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Order Query");
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
          expect(review).toMatchObject({
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
    it("200: review object has comment count property", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toHaveProperty('comment_count')
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
    it("201: ignores unrequired keys", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "philippaclaire9",
          body: "I am Groot",
          banana: 'yellow'
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
    it('400: invalid review_id', () => {
      return request(app)
        .post("/api/reviews/groot/comments")
        .send({
          username: 'philippaclaire9',
          body: 'I am Groot'
        })
        .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      })
    });
    it('404: non-existent review_id', () => {
      return request(app)
        .post("/api/reviews/99999999/comments")
        .send({
          username: 'philippaclaire9',
          body: 'I am Groot'
        })
        .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      })
    });
    it('404: username does not exist', () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: 'iAmGroot',
          body: 'I am Groot'
        })
        .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      })
    });
  });

  describe('PATCH /api/reviews/:review_id', () => {
    it('200: responds with whole updated review', () => {
      return request(app)
        .patch('/api/reviews/2/')
        .send({
          inc_votes: 3
        })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            "category": "dexterity",
            "created_at": "2021-01-18T10:01:41.251Z",
            "designer": "Leslie Scott",
            "owner": "philippaclaire9",
            "review_body": "Fiddly fun for all the family",
            "review_id": 2,
            "review_img_url": "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            "title": "Jenga",
            "votes": 8
          });
        });
    });
    it('200: responds with unmodified review if empty input', () => {
      return request(app)
        .patch('/api/reviews/2/')
        .send({})
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            "category": "dexterity",
            "created_at": "2021-01-18T10:01:41.251Z",
            "designer": "Leslie Scott",
            "owner": "philippaclaire9",
            "review_body": "Fiddly fun for all the family",
            "review_id": 2,
            "review_img_url": "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            "title": "Jenga",
            "votes": 5
          });
        });
    });
    it('200: ignores additional request body properties', () => {
      return request(app)
        .patch('/api/reviews/2/')
        .send({
          inc_votes: 2,
          isGroot: true
        })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            "category": "dexterity",
            "created_at": "2021-01-18T10:01:41.251Z",
            "designer": "Leslie Scott",
            "owner": "philippaclaire9",
            "review_body": "Fiddly fun for all the family",
            "review_id": 2,
            "review_img_url": "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            "title": "Jenga",
            "votes": 7
          });
        });
    });
    it('400: wrong format eg votes NaN', () => {
      return request(app)
        .patch('/api/reviews/2/')
        .send({
          inc_votes: 'bananas'
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad Request');
        });
    });
    it('400: invalid review id', () => {
      return request(app)
        .patch('/api/reviews/i-am-groot/')
        .send({
          inc_votes: 2
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad Request');
        });
    });
    it('404: non-existent review id', () => {
      return request(app)
        .patch('/api/reviews/9999999/')
        .send({
          inc_votes: 2
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Not Found');
        });
    });
  })

  describe('DELETE /api/comments/:comment_id', () => {
    it('204: deletes given comment_id', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204);
    });
    it('400: invalid comment id', () => {
      return request(app)
        .delete('/api/comments/i-am-groot')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad Request');
        });
    });
    it('404: non-existent comment id', () => {
      return request(app)
        .delete('/api/comments/9999999/')
        .send({
          inc_votes: 2
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Not Found');
        });
    });
  });

  describe('GET /api/users', () => {
    it('returns an array of users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body : {users}}) => {
          expect(users.length).toBe(4)
          users.forEach(user => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          })
      })
    });
  });

  describe('GET /api', () => {
    it('returns JSON describing all available endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body: { endpoints } }) => {
          Object.keys(endpoints).forEach(key => {
            expect(endpoints[key]).toHaveProperty("description")
            expect(endpoints[key]).toHaveProperty("queries")
            expect(endpoints[key]).toHaveProperty("exampleResponse")
          })
      })
    });
  });
});
