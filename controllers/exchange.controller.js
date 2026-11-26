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

module.exports = {
    createExchange
}