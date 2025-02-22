import React, { useState, useEffect } from "react";
import axios from "axios";

const PortfolioList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("❌ Failed to load portfolio.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p className="text-center text-gray-600 dark:text-white">📊 Loading portfolio...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (stocks.length === 0) return <p className="text-center text-gray-600 dark:text-white">No stocks in portfolio.</p>;

  return (
    <div className="p-4 border rounded shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">📈 My Portfolio</h2>

      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            <th className="p-2">Stock</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Current Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="text-center border-b">
              <td className="p-2 text-gray-700 dark:text-white">{stock.symbol}</td>
              <td className="p-2 text-gray-700 dark:text-white">{stock.quantity}</td>
              <td className="p-2 text-gray-700 dark:text-white">${stock.price?.toFixed(2) || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioList;
