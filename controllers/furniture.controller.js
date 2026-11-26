const Furniture = require("../models/furniture");

//  controller function to get all furniture items
const getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find();
    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//  controller function to get a single furniture item by ID
const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//  controller function to create a new furniture item
const createFurniture = async (req, res) => {
  try {
    const furniture = new Furniture(req.body);
    await furniture.save();
    res.status(201).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  controller function to update a furniture item by ID
const updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  controller function to delete a furniture item by ID
const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }
    res.status(200).json({ message: "Furniture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get furniture by category
const getFurnitureByCategory = async (req, res) => {
  try {
    const furniture = await Furniture.find({ category: req.params.category });
    if (!furniture || furniture.length === 0) {
      return res.status(404).json({ message: "No furniture found in this category" });
    }
    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get  search furniture by title or description
const searchFurnitureByKeyword = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const furniture = await Furniture.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    });
    if (!furniture || furniture.length === 0) {
      return res.status(404).json({ message: "No furniture found matching the keyword" });
    }
    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllFurniture,
  getFurnitureById,
  getFurnitureByCategory,
  createFurniture,
  updateFurniture,
  deleteFurniture,
  searchFurnitureByKeyword,
};