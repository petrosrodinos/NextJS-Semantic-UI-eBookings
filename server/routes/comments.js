const express = require("express");
const commentsController = require("../controllers/comments");
const { protect } = require("../middleware/check-auth");

const router = express.Router();

router.post("/business/comments", protect, commentsController.createComment);
router.get("/business/comments/:id", commentsController.fetchBusinessComments);
router.get("/user/comments", protect, commentsController.fetchUserComments);
router.delete("/user/comments/:id", protect, commentsController.deleteComment);
router.patch(
  "/business/comments/:id",
  protect,
  commentsController.replyComment
);

module.exports = router;
