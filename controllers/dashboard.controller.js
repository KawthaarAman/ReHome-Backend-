const Furniture = require("../models/furniture")

const ExchangeRequest = require("../models/ExchangeRequest")

// Get platform statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalListings = await Furniture.countDocuments()

    const completedExchanges = await ExchangeRequest.countDocuments({
      status: "completed"
    })

    res.status(200).json({
      totalListings,
      completedExchanges
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get recent furniture listings
const getRecentFurniture = async (req, res) => {
  try {
    const recentFurniture = await Furniture.find()
      .sort({ createdAt: -1 })
      .limit(6)

    res.status(200).json(recentFurniture)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get exchange statistics
const getExchangeStats = async (req, res) => {
  try {
    const totalExchanges = await ExchangeRequest.countDocuments()

    const pendingExchanges = await ExchangeRequest.countDocuments({
      status: "pending"
    })

    const acceptedExchanges = await ExchangeRequest.countDocuments({
      status: "accepted"
    })

    const rejectedExchanges = await ExchangeRequest.countDocuments({
      status: "rejected"
    })

    const cancelledExchanges = await ExchangeRequest.countDocuments({
      status: "cancelled"
    })

    const completedExchanges = await ExchangeRequest.countDocuments({
      status: "completed"
    })

    res.status(200).json({
      totalExchanges,
      pendingExchanges,
      acceptedExchanges,
      rejectedExchanges,
      cancelledExchanges,
      completedExchanges
    })
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getDashboardStats,
  getRecentFurniture,
  getExchangeStats
};