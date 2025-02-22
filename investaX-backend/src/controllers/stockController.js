const { fetchStockData } = require("../services/stockService");

// 📌 Fetch a list of available stocks with real-time prices
const getAvailableStocks = async (req, res) => {
  try {
    console.log("📡 Fetching available stocks...");

    const stockSymbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"]; // Example stocks

    const stocks = await Promise.all(
      stockSymbols.map(async (symbol) => {
        try {
          const stockData = await fetchStockData(symbol);
          return stockData?.price ? { symbol, price: stockData.price } : null;
        } catch (error) {
          console.warn(`⚠️ Failed to fetch ${symbol}, skipping.`);
          return null;
        }
      })
    );

    const filteredStocks = stocks.filter((stock) => stock !== null);

    if (filteredStocks.length === 0) {
      return res.status(404).json({ message: "No stock data available." });
    }

    res.json(filteredStocks);
  } catch (error) {
    console.error("❌ Error fetching available stocks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAvailableStocks };
