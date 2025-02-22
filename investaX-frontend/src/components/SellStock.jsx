import React, { useState, useEffect } from "react";
import axios from "axios";

const SellStockForm = ({ onStockSold }) => {
  const [stocks, setStocks] = useState([]); // List of available stocks
  const [selectedStock, setSelectedStock] = useState(""); // Selected stock symbol
  const [quantity, setQuantity] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");

  // Fetch the user's portfolio stocks
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStocks(response.data.stocks);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("⚠️ Failed to load portfolio.");
      }
    };

    fetchPortfolio();
  }, []);

  // Update available quantity when stock is selected
  useEffect(() => {
    if (selectedStock) {
      const stock = stocks.find((s) => s.symbol === selectedStock);
      setAvailableQuantity(stock ? stock.quantity : 0);
    } else {
      setAvailableQuantity(0);
    }
  }, [selectedStock, stocks]);

  const handleSell = async () => {
    if (!selectedStock) {
      setWarning("⚠️ Please select a stock to sell.");
      return;
    }

    if (quantity <= 0 || quantity > availableQuantity) {
      setWarning(`⚠️ Invalid quantity! You can sell up to ${availableQuantity} shares.`);
      return;
    }

    setWarning("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/portfolio/sell",
        { stockSymbol: selectedStock, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAvailableQuantity(response.data.availableQuantity);
      setQuantity(0);
      onStockSold(); // Refresh portfolio
      setError("");
    } catch (err) {
      console.error("Error selling stock:", err);
      setError(err.response?.data?.message || "❌ Failed to sell stock. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sell Stock</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Stock Selection Dropdown */}
      <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">Select Stock</label>
      <select
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
        className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      >
        <option value="">-- Select Stock --</option>
        {stocks.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.symbol} ({stock.quantity} shares)
          </option>
        ))}
      </select>

      {/* Display Available Quantity */}
      {selectedStock && (
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Available Quantity: <strong>{availableQuantity}</strong>
        </p>
      )}

      {/* Quantity Input */}
      <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1 mt-2">Quantity to Sell</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Enter quantity"
        className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />

      {warning && <p className="text-red-500 mt-2">{warning}</p>}

      <button
        onClick={handleSell}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
        disabled={loading || !selectedStock || quantity <= 0 || quantity > availableQuantity}
      >
        {loading ? "Processing..." : "Sell Stock"}
      </button>
    </div>
  );
};

export default SellStockForm;
