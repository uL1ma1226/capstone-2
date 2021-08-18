const express = require('express');
const router = express.Router();
const { createOrder, userOrder, allOrder } = require('../controllers/orderControllers')
const { verifyToken, verifyIsAdmin } = require('../auth')

router.post("/createOrder", verifyToken, createOrder);
router.get("/userOrder", verifyToken, userOrder);
router.get("/allOrder/admin", verifyToken, verifyIsAdmin, allOrder); //admin only

module.exports = router; 