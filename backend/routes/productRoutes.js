const express = require("express");
const {
  addProduct,
  getProducts,
  deleteProduct,
  getPriceHistory,
} = require("../controllers/productController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", addProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.get("/:id/history", getPriceHistory);

module.exports = router;
