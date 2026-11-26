const Favorite = require("../models/Favorite");

const Furniture = require("../models/furniture");

// Add favorite
const addFavorite = async (req, res) => {
  try {
    const { furniture } = req.body

    // Check if furniture exists
    const furnitureExists = await Furniture.findById(furniture)

    if (!furnitureExists) {
      return res.status(404).json({ message: "Furniture not found" })
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      furniture: furniture,
    })

    if (existingFavorite) {
      return res.status(400).json({ message: "Already in favorites" })
    }

    // Create favorite
    const newFavorite = await Favorite.create({
      user: req.user._id,
      furniture: furniture,
    })

    res.status(201).json(newFavorite)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all my favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id,
    }).populate("furniture")

    res.status(200).json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get favorites for a specific user
const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.params.userId,
    }).populate("furniture")

    res.status(200).json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get favorite by ID
const getFavoritesById = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("furniture")

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" })
    }

    res.status(200).json(favorite)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete favorite
const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" })
    }

    await Favorite.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Favorite removed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  addFavorite,
  getFavorites,
  getUserFavorites,
  getFavoritesById,
  deleteFavorite,
};