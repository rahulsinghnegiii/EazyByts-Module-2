import { useState, useEffect } from "react";
import axios from "axios";

const StockData = ({ stockSymbol }) => {
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stockSymbol) return;

    const fetchStockData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`http://localhost:5000/api/stocks/${stockSymbol}`);
        setStockInfo(response.data);
      } catch (err) {
        setError("Failed to fetch stock data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stockSymbol]);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Stock Information</h2>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading stock data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : stockInfo ? (
        <div className="text-gray-900 dark:text-white">
          <p><strong>Symbol:</strong> {stockInfo.symbol}</p>
          <p><strong>Current Price:</strong> ${stockInfo.currentPrice.toFixed(2)}</p>
          <p><strong>High:</strong> ${stockInfo.high.toFixed(2)}</p>
          <p><strong>Low:</strong> ${stockInfo.low.toFixed(2)}</p>
          <p>
            <strong>Change:</strong>{" "}
            {stockInfo.change >= 0 ? (
              <span className="text-green-500">+{stockInfo.change.toFixed(2)}%</span>
            ) : (
              <span className="text-red-500">{stockInfo.change.toFixed(2)}%</span>
            )}
          </p>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No data available.</p>
      )}
    </div>
  );
};

export default StockData;
