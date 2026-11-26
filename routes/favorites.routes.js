const router = require("express").Router();

const verfiyToken = require("../middleware/verifyToken")

const favoritesController = require("../controllers/favorites.controller")

// Add favorite
router.post('/', verfiyToken, favoritesController.addFavorite)

// Get all favorites
router.get('/', verfiyToken, favoritesController.getFavorites)

// Get favorites for a specific user
router.get('/:userId', verfiyToken, favoritesController.getUserFavorites)

// Remove favorite
router.delete('/:id',verfiyToken, favoritesController.deleteFavrite)

module.exports = router;