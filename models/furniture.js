 const mongoose = require("mongoose");
 
 const furnitureSchema = new mongoose.Schema({
   title: {
     type: String,
     required: true
   },
   description: {
     type: String,
     required: true
   },
   price: {
     type: Number,
     required: true
   },
   category: {
     type: String,
     enum: ["Living room", "Bedroom", "Bathroom", "Kitchen", "Home office", "Outdoor", "Dining room" , "Other"],
     required: true
   },
   condition: {
     type: String,
     enum: ["New", "Like New", "Good", "Fair", "Poor"],
     required: true
   },
   imageUrl: {
     type: String,
     required: true
   } ,
   location: {
     type: String,
     required: true
   } ,
   status: {
     type: String,
     enum: ["Available", "Sold" ],
     required: true
   },
   createdAt: {
     type: Date,
     default: Date.now
   },
  
 });

 module.exports = mongoose.model("Furniture", furnitureSchema);