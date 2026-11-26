const router = require("express").Router();

const verifyToken = require("../middleware/verifyToken");

const favoritesController = require("../controllers/favorites.controller");

// Add favorite
router.post("/", verifyToken, favoritesController.addFavorite)

// Get all favorites
router.get("/", verifyToken, favoritesController.getFavorites)

// Get one favorite by its Id
router.get("/favorite/:id", verifyToken, favoritesController.getFavoritesById)

// Get favorite for a specefic user
router.get("/:userId", verifyToken, favoritesController.getUserFavorites)

// Remove favorite
router.delete("/:id", verifyToken, favoritesController.deleteFavorite)

module.exports = router;