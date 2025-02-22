import { useState, useEffect } from "react";
import axios from "axios";

const BuyStock = ({ onStockBought }) => {
  const [stocks, setStocks] = useState([]); // Available stocks with prices
  const [selectedStock, setSelectedStock] = useState(""); // Selected stock symbol
  const [stockPrice, setStockPrice] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch available stocks with prices
  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks/available"); // Correct endpoint
      setStocks(response.data); // [{ symbol: "AAPL", price: 185.5 }, { symbol: "TSLA", price: 205 }]
      setError(""); // Clear previous error
    } catch (err) {
      console.error("Error fetching stocks:", err);
      setError("⚠️ Failed to load available stocks.");
    }
  };

  // Auto-fetch stocks every 10 seconds
  useEffect(() => {
    fetchStocks(); // Initial fetch

    const interval = setInterval(() => {
      fetchStocks(); // Fetch stocks every 10 seconds
    }, 10000); // 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Update stock price when user selects a stock
  useEffect(() => {
    if (selectedStock) {
      const stock = stocks.find((s) => s.symbol === selectedStock);
      setStockPrice(stock ? stock.price : null);
    } else {
      setStockPrice(null);
    }
  }, [selectedStock, stocks]);

  const validateInputs = () => {
    if (!selectedStock) return "⚠️ Please select a stock.";
    if (!quantity || quantity <= 0) return "⚠️ Quantity must be a positive number.";
    return null;
  };

  const handleBuyStock = async () => {
    setMessage("");
    setError("");

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/portfolio/buy",
        { stockSymbol: selectedStock, quantity: parseInt(quantity, 10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setSelectedStock("");
      setQuantity("");

      onStockBought(); // Refresh portfolio after buying
      fetchStocks(); // Refresh stocks after buying
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error buying stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Buy Stock</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      {/* Stock Selection Dropdown */}
      <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">Select Stock</label>
      <select
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
        className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
      >
        <option value="">-- Select Stock --</option>
        {stocks.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.symbol} (${stock.price.toFixed(2)})
          </option>
        ))}
      </select>

      {/* Display Selected Stock Price */}
      {selectedStock && (
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Current Price: <strong>${stockPrice?.toFixed(2) || "N/A"}</strong>
        </p>
      )}

      {/* Quantity Input */}
      <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1 mt-2">Quantity</label>
      <input
        type="number"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />

      {/* Buy Button */}
      <button
        onClick={handleBuyStock}
        className={`px-4 py-2 rounded w-full transition duration-200 ${
          loading ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        disabled={loading || validateInputs()}
      >
        {loading ? "Processing..." : "Buy"}
      </button>
    </div>
  );
};

export default BuyStock;
