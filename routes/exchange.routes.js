const router = require("express").Router()
const verifyToken = require('../middleware/verifyToken')
const exchangeController = require('../controllers/exchange.controller')

router.post("/", verifyToken, exchangeController.createExchange)

module.exports = router