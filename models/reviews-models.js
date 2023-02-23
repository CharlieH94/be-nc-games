const db = require("../db/connection");
const { reviewData } = require("../db/data/test-data/index.js");

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const validSortBy = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];
  const validOrderType = ["ASC", "DESC"];
  const variables = [];
  let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST(COUNT(comment_id) AS INTEGER) AS comment_count
  FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  if (category !== undefined) {
    queryString += " WHERE category = $1";
    variables.push(category);
  }

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject("Invalid Sort Query");
  }

  if (!validOrderType.includes(order.toUpperCase())) {
    return Promise.reject("Invalid Order Query");
  }

  queryString += ` GROUP BY reviews.review_id ORDER BY reviews.${sort_by} ${order};`;

  return db.query(queryString, variables).then((reviewData) => {
    return reviewData.rows;
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(`
      SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comments.comment_id) AS comment_count FROM reviews 
  FULL JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;`, [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("No ID Found");
      }
      return result.rows[0];
    });
};

exports.updateVotesByReviewId = (review_id, voteObj) => {
  const { inc_votes } = voteObj;
  const variables = [review_id];
  let queryString = "UPDATE reviews SET votes = votes";

  if (inc_votes !== undefined) {
    queryString += " + $2";
    variables.push(inc_votes);
  }
  queryString += " WHERE review_id = $1 RETURNING *;";

  return db.query(queryString, variables).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("No ID Found");
    }
    return result.rows[0];
  });
};
