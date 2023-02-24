const db = require("../db/connection");
const { commentData } = require("../db/data/test-data/index.js");

exports.fetchComments = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;
    `,
      [review_id]
    )
    .then((result) => result.rows);
};

exports.insertComment = (newComment, review_id) => {
  return db
    .query(
      `
    INSERT INTO comments
        (author, body, review_id)
    VALUES
        ($1, $2, $3)
    RETURNING *;
    `,
      [newComment.username, newComment.body, review_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
      DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
      [comment_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject("No ID Found");
      }
      return result.rows[0];
    });
};
