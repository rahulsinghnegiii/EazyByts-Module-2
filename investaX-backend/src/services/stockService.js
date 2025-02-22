const yahooFinance = require("yahoo-finance2").default; // ✅ Import correctly

const fetchStockData = async (stockSymbol) => {
  try {
    console.log(`📡 Fetching stock data for: ${stockSymbol}`);

    // ✅ Correct method for getting stock price
    const stockData = await yahooFinance.quote(stockSymbol);

    if (!stockData || !stockData.regularMarketPrice) {
      throw new Error("Stock data not available.");
    }

    return {
      symbol: stockSymbol.toUpperCase(),
      price: stockData.regularMarketPrice, // ✅ Corrected field
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error fetching stock data:", error.message);
    throw new Error("Failed to fetch stock data.");
  }
};

module.exports = { fetchStockData };
