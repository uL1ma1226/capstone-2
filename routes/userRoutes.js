const express = require('express');
const router = express.Router();
const { registerUser, loginUser, userDetails, updateUser, changePassword, userCheckout, /* emptyCart */ checkCart, makeAdmin, deactivateUser} = require("../controllers/userControllers");
const { verifyToken, verifyIsAdmin } = require('../auth')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", verifyToken, userDetails); //userdetails
router.put("/", verifyToken, updateUser); //updateuserdetails
router.put("/change-password", verifyToken, changePassword)
router.post("/addToCart", verifyToken, userCheckout)
// router.delete("/emptyCart", verifyToken, emptyCart)
router.get("/checkCart",verifyToken, checkCart)
router.put("/makeAdmin", verifyToken, verifyIsAdmin, makeAdmin)
router.delete("/deactivate", verifyToken, deactivateUser)

module.exports = router;