import { useState } from "react";
import Portfolio from "../components/Portfolio";
import BuyStock from "../components/BuyStock";
import SellStock from "../components/SellStock";
import TransactionHistory from "../components/TransactionHistory";
import PortfolioChart from "../components/PortfolioChart";
import DarkModeToggle from "../components/DarkModeToggle";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock Dashboard</h1>
        <DarkModeToggle />
      </div>

      <BuyStock onStockBought={() => setRefresh(!refresh)} />
      <SellStock onStockSold={() => setRefresh(!refresh)} />
      <Portfolio key={refresh} />
      <PortfolioChart key={refresh} />
      <TransactionHistory />
    </div>
  );
};

export default Dashboard;
