const ExchangeRequest = require('../models/ExchangeRequest')
const Furniture = require('../models/furniture')
const mongoose = require('mongoose')

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

module.exports = {
    createExchange
}