const mongoose = require('mongoose')
const exchangeRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedFurniture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true
    },
    offeredFurniture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true
    },
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    }
}, {timestamps: true})

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema)

module.exports = ExchangeRequest