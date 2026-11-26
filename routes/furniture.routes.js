const express = require("express");
const router = express.Router();
const furnitureController = require("../controllers/furniture.controller");

// Furniture routes

/// Get all furniture items to the routes
router.get("/", furnitureController.getAllFurniture);
/// Get furniture item by ID
router.get("/:id", furnitureController.getFurnitureById);
/// Get furniture items by category
router.get("/category/:category", furnitureController.getFurnitureByCategory);
/// Search furniture items by title or description
router.get("/search/:keyword", furnitureController.searchFurnitureByKeyword);
/// Create a new furniture item
router.post("/", furnitureController.createFurniture);
/// Update a furniture item by ID
router.put("/:id", furnitureController.updateFurniture);
/// Delete a furniture item by ID
router.delete("/:id", furnitureController.deleteFurniture);

module.exports = router;