const express = require('express');
const router = express.Router();
const { allActiveProducts, oneActiveProduct, allProducts, oneProduct, createProduct, updateProduct, archiveProduct, storeProduct } = require('../controllers/productsControllers')
const { verifyToken, verifyIsAdmin } = require('../auth')

router.get("/all", allActiveProducts);
router.get("/:productId", oneActiveProduct);
router.get("/all/admin", verifyToken, verifyIsAdmin, allProducts);//admin only, show also inactive
router.get("/:productId/admin", verifyToken, verifyIsAdmin, oneProduct);//admin only, show also inactive
router.post("/create/admin", verifyToken, verifyIsAdmin, createProduct);//admin only
router.put("/update/:productId/admin", verifyToken, verifyIsAdmin, updateProduct);//admin only
router.put("/store/:productId/admin", verifyToken, verifyIsAdmin, storeProduct)
router.delete("/archive/:productId/admin", verifyToken, verifyIsAdmin, archiveProduct);//admin only

module.exports = router;