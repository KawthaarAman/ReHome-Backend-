const ExchangeRequest = require('../models/ExchangeRequest')
const Furniture = require('../models/furniture')
const mongoose = require('mongoose')
const User = require('../models/User')

async function createExchange(req,res) {
    try{
        const {requestedFurniture, offeredFurniture, message} = req.body
        const sender = req.user._id

        if (requestedFurniture === offeredFurniture){
            return res.status(400).json({message: 'You cannot offer the same furniture you requested'})
        }

        const requestedItem = await Furniture.findById(requestedFurniture)
        const offeredItem = await Furniture.findById(offeredFurniture)

        if(!requestedItem || !offeredItem){
            return res.status(404).json({message: 'Furniture not found'})
        }

        if (requestedItem.owner._id === sender._id){
            return res.status(400).json({message: 'You cannot request your own furniture'})
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
            sender: userId, receiver: userId
        }).populate("sender", "username")
        .populate("receiver", "username")
        .populate("requestedFurniture", "title img status")
        .populate("offeredFurniture", "title img status")
        .sort({createdAt: -1})

        return res.status(200).json(exchanges)
    }
    catch(err){
        return res.status(500).json({message: "Failed to get exchange requests"})
    }
}

async function getExchangeById(req,res) {
    try{
        const exchange = await ExchangeRequest.findById(req.params.id).populate("sender", "username")
        .populate("receiver", "username")
        .populate("requestedFurniture", "title img status")
        .populate("offeredFurniture", "title img status")

        if(!exchange){
            return res.status(404).json({message: "Exchange request not found"})
        }

        const userId = req.user._id
        const senderId = req.sender._id
        const receiverId = req.receiver._id

        if(userId !== senderId && userId !== receiverId) {
            return res.status(403).json({message: "You are not authorized to view this request"})
        }

        return res.status(200).json(exchange)
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

        if(exchange.receiver._id !== req.user._id){
            return res.status(403).json({message: "Only the furniture owner can respond"})
        }

        if(exchange.status !== "pending"){
            return res.status(400).json({message: "Only pending requests can be accepted or rejected"})
        }

        if(status === "accepted"){
            const requestedItem = await Furniture.findById(exchange.requestedFurniture)

            const offeredItem = await Furniture.findById(exchange.offeredFurniture)
        }

        if(!requestedItem || !offeredItem){
            return res.status(404).json({message: "Furniture not found"})
        }

        exchange.status = status
        await exchange.save()

        res.status(200).json({message: `Exchange request ${status}`, exchange})
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

        if(exchange.sender._id !== req.user._id){
            return res.status(403).json({message: "Only the requester can complete this exchange"})
        }

        if(exchange.status !== "accepted"){
            return res.status(400).json({message: "Only accepted exchanges can be completed"})
        }

        const requestedItem = await Furniture.findById(exchange.requestedFurniture)

        const offeredItem = await Furniture.findById(exchange.offeredFurniture)

        if(!requestedItem || !offeredItem){
            return res.status(404).json({message: "Furniture not found"})
        }

        requestedItem.status = "Sold"
        offeredItem.status = "Sold"
        await requestedItem.save()
        await offeredItem.save()

        exchange.status = "completed"
        await exchange.save()

        res.status(200).json({message: `Exchange completed successfully`, exchange})
    }
    catch(err){
        return res.status(500).json({message: "Failed to complete exchange"})
    }
}

async function updateExchange(req,res) {
    const {status} = req.body

    if(status === "accepted" || status === "rejected"){
        return respondToExchange(req,res)
    }

    if(status === "completed"){
        return completeExchange(req,res)
    }

    return res.status(400).json({message: "Invalid exchange status"})
}

module.exports = {
    createExchange
}