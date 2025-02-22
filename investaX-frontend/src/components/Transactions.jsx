import { useState } from "react";
import BuyStock from "./BuyStock";
import SellStock from "./SellStock";
import TransactionHistory from "./TransactionHistory";

const Transactions = () => {
  const [refresh, setRefresh] = useState(false);

  const handleTransactionUpdate = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Transactions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuyStock onStockBought={handleTransactionUpdate} />
        <SellStock onStockSold={handleTransactionUpdate} />
      </div>

      <TransactionHistory key={refresh} />
    </div>
  );
};

export default Transactions;
