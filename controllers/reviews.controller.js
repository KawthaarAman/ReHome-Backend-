const Review = require("../models/Review");

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewer", "username name profileImage")
      .populate("reviewedUser", "username name profileImage")
      .sort({ createdAt: -1 })

    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get reviews for a specific user
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewedUser: req.params.userId
    })
      .populate("reviewer", "username name profileImage")
      .populate("reviewedUser", "username name profileImage")
      .sort({ createdAt: -1 })

    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add a review
const createReview = async (req, res) => {
  try {
    const { reviewedUser, rating, comment } = req.body

    // Prevent reviewing yourself
    if (reviewedUser === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot review yourself"
      })
    }

    const newReview = await Review.create({
      reviewer: req.user._id,
      reviewedUser: reviewedUser,
      rating: rating,
      comment: comment
    })

    res.status(201).json(newReview)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// Update a review
const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user._id
    })

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you are not the owner"
      })
    }

    review.rating = req.body.rating || review.rating
    review.comment = req.body.comment || review.comment

    await review.save()

    res.status(200).json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// Delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      reviewer: req.user._id
    })

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you are not the owner"
      })
    }

    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Review deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview
};