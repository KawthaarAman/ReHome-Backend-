const router = require("express").Router();

const reviewsController = require("../controllers/reviews.controller")

const verifyToken = require("../middleware/verifyToken")

// Get all reviews
router.get("/", reviewsController.getAllReviews)

// Get reviews for a specific user
router.get("/:userId", reviewsController.getUserReviews)

// Add a review
router.post("/", verifyToken, reviewsController.createReview)

// Update a review
router.put("/:id", verifyToken, reviewsController.updateReview)

// Delete a review
router.delete("/:id", verifyToken, reviewsController.deleteReview)

module.exports = router;