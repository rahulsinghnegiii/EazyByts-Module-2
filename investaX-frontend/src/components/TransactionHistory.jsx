import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/portfolio/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(response.data);
      } catch (err) {
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 border rounded-lg shadow-md mt-4 bg-white dark:bg-gray-800"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Transaction History</h2>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <motion.div
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                <th className="border p-3">Type</th>
                <th className="border p-3">Stock</th>
                <th className="border p-3">Quantity</th>
                <th className="border p-3">Price</th>
                <th className="border p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <motion.tr
                  key={transaction._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-center text-gray-800 dark:text-gray-200"
                >
                  <td
                    className={`border p-3 font-semibold ${
                      transaction.type === "buy"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type.toUpperCase()}
                  </td>
                  <td className="border p-3">{transaction.stockSymbol}</td>
                  <td className="border p-3">{transaction.quantity}</td>
                  <td className="border p-3">${transaction.price.toFixed(2)}</td>
                  <td className="border p-3">{new Date(transaction.createdAt).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
