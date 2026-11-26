const router = require("express").Router();

const dashboardController = require("../controllers/dashboard.controller")

const verifyToken = require("../middleware/verifyToken")

// Get platform statistics
router.get("/stats", verifyToken, dashboardController.getDashboardStats)

// Get recent furniture listings
router.get("/recent", verifyToken, dashboardController.getRecentFurniture)

// Get exchange statistics
router.get("/exchanges", verifyToken, dashboardController.getExchangeStats)

module.exports = router;