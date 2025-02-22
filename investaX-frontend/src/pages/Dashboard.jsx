import { useState } from "react";
import Portfolio from "../components/Portfolio";
import BuyStock from "../components/BuyStock";
import SellStock from "../components/SellStock";
import TransactionHistory from "../components/TransactionHistory";
import PortfolioChart from "../components/PortfolioChart";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev); // Toggle refresh state

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Stock Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Buy & Sell Stock Components */}
        <BuyStock onStockBought={triggerRefresh} />
        <SellStock onStockSold={triggerRefresh} />

        {/* Portfolio Breakdown Chart */}
        <div className="md:col-span-2 lg:col-span-1">
          <PortfolioChart refresh={refresh} />
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="mt-6">
        <Portfolio refresh={refresh} />
      </div>

      {/* Transaction History */}
      <div className="mt-6">
        <TransactionHistory refresh={refresh} />
      </div>
    </div>
  );
};

export default Dashboard;
