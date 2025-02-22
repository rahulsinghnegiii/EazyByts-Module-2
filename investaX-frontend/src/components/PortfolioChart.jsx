import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB", "#9966FF"];

const PortfolioChart = ({ refresh }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.stocks.map((stock, index) => ({
          name: stock.symbol,
          value: stock.quantity * stock.currentPrice,
          color: COLORS[index % COLORS.length],
        }));

        setChartData(data);
      } catch (err) {
        setError("Failed to load portfolio data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [refresh]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Portfolio Breakdown</h2>

      {loading ? (
        <div className="w-full h-80 flex items-center justify-center">
          <motion.div 
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : chartData.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No stocks in portfolio.</p>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6 }}
          className="w-full h-80 flex justify-center"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <motion.g 
                    key={index} 
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Cell fill={entry.color} />
                  </motion.g>
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PortfolioChart;
