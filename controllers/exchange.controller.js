const ExchangeRequest = require('../models/ExchangeRequest')
const Furniture = require('../models/furniture')
const mongoose = require('mongoose')


async function createExchange(req,res) {
    try{
        const {requestedFurniture, offeredFurniture, message} = req.body
        const sender = req.user._id

        if(!mongoose.isValidObjectId(requestedFurniture) || !mongoose.isValidObjectId(offeredFurniture)){
            return res.status(400).json({message:'Invalid furniture id'})
        }

        if (requestedFurniture === offeredFurniture){
            return res.status(400).json({message: 'You cannot offer the same furniture you requested'})
        }

        const requestedItem = await Furniture.findById(requestedFurniture)
        const offeredItem = await Furniture.findById(offeredFurniture)

        if(!requestedItem || !offeredItem){
            return res.status(404).json({message: 'Furniture not found'})
        }

        if (requestedItem.owner.toString() === sender.toString()){
            return res.status(400).json({message: 'You cannot request your own furniture'})
        }

        if (offeredItem.owner.toString() !== sender.toString()){
            return res.status(403).json({message: 'You can only offer furniture that you own'})
        }

        const newExchange = await ExchangeRequest.create({
            sender,
            receiver: requestedItem.owner,
            requestedFurniture,
            offeredFurniture,
            message
        })

        res.status(201).json(newExchange)
    }
    catch (err) {
        return res.status(500).json({message: "Failed to create exchange request"})
    }
}

async function getAllExchanges(req,res) {
    try{
        const userId = req.user._id

        const exchanges = await ExchangeRequest.find({
            $or: [{sender: userId}, {receiver: userId}]
        }).populate("sender", "username name profileImage")
        .populate("receiver", "username name profileImage")
        .populate("requestedFurniture", "title imageUrl status")
        .populate("offeredFurniture", "title imageUrl status")
        .sort({createdAt: -1})

        return res.status(200).json(exchanges)
    }
    catch(err){
        return res.status(500).json({message: "Failed to get exchange requests"})
    }
}

async function getExchangeById(req,res) {
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({message: "Invalid exchange Id"})
        }

        const exchange = await ExchangeRequest.findById(req.params.id).populate("sender", "username name profileImage")
        .populate("receiver", "username name profileImage phone")
        .populate("requestedFurniture", "title imageUrl status")
        .populate("offeredFurniture", "title imageUrl status")

        if(!exchange){
            return res.status(404).json({message: "Exchange request not found"})
        }

        const userId = req.user._id.toString()
        const senderId = exchange.sender._id.toString()
        const receiverId = exchange.receiver._id.toString()

        if(userId !== senderId && userId !== receiverId) {
            return res.status(403).json({message: "You are not authorized to view this request"})
        }

        const result = exchange.toObject()

        if(exchange.status !== "accepted" || userId !== senderId){
            delete result.receiver.phone
        }

        return res.status(200).json (result)
    }
    catch(err){
        return res.status(500).json({message: "Failed to get exchange request"})
    }
}

async function respondToExchange(req,res) {
    try{
        const {status} = req.body
        const exchange = await ExchangeRequest.findById(req.params.id)

        if(!exchange){
            return res.status(404).json({message: "Exchange request not found"})
        }

        if(exchange.receiver.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Only the furniture owner can respond"})
        }

        if(exchange.status !== "pending"){
            return res.status(400).json({message: "Only pending requests can be accepted or rejected"})
        }

        if(status === "accepted"){
            const requestedItem = await Furniture.findById(exchange.requestedFurniture)

            const offeredItem = await Furniture.findById(exchange.offeredFurniture)

            if(!requestedItem || !offeredItem){
                return res.status(404).json({message: "Furniture not found"})
            }

            if(requestedItem.status !== "Available" || offeredItem.status !== "Available"){
                return res.status(400).json({message: "Both furniture items must be available"})
            }
        }


        const updatedExchange = await ExchangeRequest.findByIdAndUpdate(req.params.id, {status}, {new: true, runValidators: true})

        res.status(200).json({message: `Exchange request ${status}`, updatedExchange})
    }
    catch(err){
        return res.status(500).json({message: "Failed to respond to exchange request"})
    }
}

async function completeExchange(req,res) {
    try{
        const exchange = await ExchangeRequest.findById(req.params.id)

        if(!exchange){
            return res.status(404).json({message: "Exchange request not found"})
        }

        if(exchange.sender.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Only the requester can complete this exchange"})
        }

        if(exchange.status !== "accepted"){
            return res.status(400).json({message: "Only accepted exchanges can be completed"})
        }

        await Furniture.findByIdAndUpdate(exchange.requestedFurniture, {status: "Sold"})

        await Furniture.findByIdAndUpdate(exchange.offeredFurniture, {status: "Sold"})

        const updatedExchange = await ExchangeRequest.findByIdAndUpdate(req.params.id, {status: "completed"}, {new: true, runValidators: true})

        res.status(200).json(updatedExchange)
    }
    catch(err){
        return res.status(500).json({message: "Failed to complete exchange"})
    }
}

async function editExchange(req,res) {
    try{
        const {message, offeredFurniture} = req.body
        const exchange = await ExchangeRequest.findById(req.params.id)

        if(!exchange){
            return res.status(404).json({message: "Exchange request not found"})
        }

        if(exchange.sender.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Only the requester can edit this request"})
        }

        if(exchange.status !== "pending"){
            return res.status(400).json({message: "Only pending requests can be edited"})
        }

        const updates = {}

        if(offeredFurniture !== undefined){
            if(!mongoose.isValidObjectId(offeredFurniture)){
                return res.status(400).json({message: "Invalid furniture Id"})
            }

            if(offeredFurniture === exchange.requestedFurniture.toString()){
                return res.status(400).json({message: "You cannot offer the same furniture you requested"})
            }

            const offeredItem = await Furniture.findById(offeredFurniture)

            if(!offeredItem){
                return res.status(404).json({message: "Furniture not found"})
            }

            if(offeredItem.owner.toString() !== req.user._id.toString()){
                return res.status(403).json({message: "You can only offer furniture that you own"})
            }

            updates.offeredFurniture = offeredFurniture
        }

        if(message !== undefined) updates.message = message

        const updatedExchange = await ExchangeRequest.findByIdAndUpdate(req.params.id, updates, {new: true, runValidators: true})

        return res.status(200).json(updatedExchange)
    }
    catch(err){
        return res.status(500).json({message: "Failed to edit exchange request"})
    }
}

async function updateExchange(req,res) {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({message: "Invalid exchange Id"})
    }

    const {status} = req.body

    if(status === undefined){
        return editExchange(req,res)
    }

    if(status === "accepted" || status === "rejected"){
        return respondToExchange(req,res)
    }

    if(status === "completed"){
        return completeExchange(req,res)
    }

    return res.status(400).json({message: "Invalid exchange status"})
}

async function deleteExchange(req,res) {
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({message: "Invalid exchange Id"})
    }
        const exchange = await ExchangeRequest.findById(req.params.id)

        if(!exchange){
            return res.status(404).json({message: "Exchange request not found"})
        }

        if(exchange.sender.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Only the requester can delete this request"})
        }

        if(exchange.status === "accepted" || exchange.status === "completed"){
            return res.status(400).json({message: "Accepted or completed exchanges cannot be deleted"})
        }

        await ExchangeRequest.findByIdAndDelete(req.params.id)

        return res.status(200).json({message: `Exchange request deleted`})
    }
    catch(err){
        return res.status(500).json({message: "Failed to delete exchange request"})
    }
}

module.exports = {
    createExchange,
    getAllExchanges,
    getExchangeById,
    updateExchange,
    deleteExchange
}