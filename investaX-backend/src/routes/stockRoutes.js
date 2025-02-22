const express = require("express");
const { fetchStockData } = require("../services/stockService");
const { protect } = require("../middleware/authMiddleware");
const { getAvailableStocks } = require("../controllers/stockController");

const router = express.Router();

// 📌 Get available stocks list with prices (Move this above the :symbol route)
router.get("/available", getAvailableStocks); // Add `protect` if authentication is required

// 📌 Get real-time stock price for a specific stock
router.get("/:symbol", protect, async (req, res) => {
  const { symbol } = req.params;
  try {
    const stockData = await fetchStockData(symbol);
    res.json(stockData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock data" });
  }
});

module.exports = router;
