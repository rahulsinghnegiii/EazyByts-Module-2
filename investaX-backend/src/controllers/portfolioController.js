const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");
const { fetchStockData } = require("../services/stockService");

// 📌 Get user's portfolio with live stock prices
const getPortfolio = async (req, res) => {
  try {
    console.log("📌 Portfolio Request Received for User:", req.user.id);

    let portfolio = await Portfolio.findOne({ user: req.user.id }).populate("user", "name email");

    if (!portfolio) {
      console.log("🛠 Portfolio not found, creating a new one");
      portfolio = new Portfolio({ user: req.user.id, stocks: [] });
      await portfolio.save();
    }

    let totalPortfolioValue = 0;

    const updatedStocks = await Promise.all(
      portfolio.stocks.map(async (stock) => {
        try {
          const stockData = await fetchStockData(stock.symbol);
          const currentPrice = stockData.price;
          const profitLoss = ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
          totalPortfolioValue += currentPrice * stock.quantity;

          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            purchasePrice: stock.purchasePrice,
            currentPrice,
            profitLoss: profitLoss.toFixed(2),
          };
        } catch (error) {
          console.warn(`⚠️ Warning: Failed to fetch data for ${stock.symbol}. Using stored price.`);
          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            purchasePrice: stock.purchasePrice,
            currentPrice: "Unavailable",
            profitLoss: "N/A",
          };
        }
      })
    );

    res.json({
      user: portfolio.user,
      stocks: updatedStocks,
      totalPortfolioValue: totalPortfolioValue.toFixed(2),
    });
  } catch (error) {
    console.error("❌ Error fetching portfolio:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Buy stock and add to portfolio
const buyStock = async (req, res) => {
  const { stockSymbol, quantity } = req.body;

  try {
    console.log(`🛒 Buy request received: ${quantity} shares of ${stockSymbol.toUpperCase()}`);

    const stockData = await fetchStockData(stockSymbol);
    if (!stockData || !stockData.price) throw new Error("Stock data unavailable.");

    const price = stockData.price;
    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      portfolio = new Portfolio({ user: req.user.id, stocks: [] });
    }

    const existingStock = portfolio.stocks.find(
      (stock) => stock.symbol.toUpperCase() === stockSymbol.toUpperCase()
    );

    if (existingStock) {
      const totalQuantity = existingStock.quantity + quantity;
      existingStock.purchasePrice =
        (existingStock.purchasePrice * existingStock.quantity + price * quantity) / totalQuantity;
      existingStock.quantity = totalQuantity;
    } else {
      portfolio.stocks.push({
        symbol: stockSymbol.toUpperCase(),
        quantity,
        purchasePrice: price,
      });
    }

    await portfolio.save();
    await new Transaction({ user: req.user.id, type: "buy", stockSymbol, quantity, price }).save();

    console.log(`✅ Bought ${quantity} shares of ${stockSymbol} at $${price}`);

    res.status(201).json({
      message: "Stock bought successfully",
      portfolio: portfolio.stocks.map(stock => ({
        symbol: stock.symbol,
        quantity: stock.quantity,
        purchasePrice: stock.purchasePrice.toFixed(2),
      })),
    });
  } catch (error) {
    console.error("❌ Error in buyStock:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 Sell stock from portfolio
const sellStock = async (req, res) => {
  const { stockSymbol, quantity } = req.body;

  try {
    console.log(`📌 Sell request received for ${quantity} shares of ${stockSymbol}`);

    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      console.log("🚨 Portfolio not found for user:", req.user.id);
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // 🔹 Find the stock in the portfolio (case-insensitive)
    const stockIndex = portfolio.stocks.findIndex(
      (s) => s.symbol.toUpperCase() === stockSymbol.toUpperCase()
    );

    if (stockIndex === -1) {
      console.log("❌ Stock not found in portfolio:", stockSymbol);
      return res.status(400).json({ message: "Stock not found in portfolio" });
    }

    const userStock = portfolio.stocks[stockIndex];

    console.log(
      `🔍 Checking stock: ${stockSymbol}, Available: ${userStock.quantity}, Requested: ${quantity}`
    );

    // 🔹 Check if the user has enough quantity to sell
    if (userStock.quantity < quantity) {
      console.log("❌ Insufficient quantity. Available:", userStock.quantity);
      return res.status(400).json({
        message: "❌ Insufficient quantity to sell",
        availableQuantity: userStock.quantity,
      });
    }

    // ✅ Fetch real-time selling price from Yahoo Finance
    const stockData = await fetchStockData(stockSymbol);
    if (!stockData || !stockData.price) throw new Error("Stock data unavailable.");
    
    const sellPrice = stockData.price;
    
    // 🔹 Reduce quantity directly
    userStock.quantity -= quantity;

    // 🔹 If all shares are sold, remove stock from portfolio
    if (userStock.quantity === 0) {
      portfolio.stocks.splice(stockIndex, 1);
      console.log(`🗑 Removed ${stockSymbol} from portfolio as quantity is now zero.`);
    }

    // 🔹 Save changes to database
    await Promise.all([
      portfolio.save(),
      new Transaction({
        user: req.user.id,
        type: "sell",
        stockSymbol,
        quantity,
        price: sellPrice,
      }).save(),
    ]);

    console.log(`✅ Successfully sold ${quantity} shares of ${stockSymbol} at $${sellPrice}`);

    // 🔹 Return updated available stocks
    const availableStocks = portfolio.stocks.map((stock) => ({
      symbol: stock.symbol,
      quantity: stock.quantity,
      purchasePrice: stock.purchasePrice.toFixed(2),
    }));

    res.status(200).json({
      message: `Sold ${quantity} shares of ${stockSymbol} at $${sellPrice}`,
      availableStocks, // Show updated portfolio
    });
  } catch (error) {
    console.error("❌ Error selling stock:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get user's transaction history
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPortfolio, buyStock, sellStock, getTransactions };
