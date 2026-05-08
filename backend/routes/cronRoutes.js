const express = require("express");
const {
  checkPrices,
  checkPricesStatus,
} = require("../controllers/cronController");

const router = express.Router();

router.post("/check-prices", checkPrices);
router.get("/check-prices", checkPricesStatus);

module.exports = router;
