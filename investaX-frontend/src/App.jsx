import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StockData from "./components/StockData";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const App = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar outside protected routes */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
  
      <Routes>
        {/* Authentication Page */}
        <Route path="/auth" element={<AuthPage />} />
  
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/stocks"
            element={
              <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold">Stock Market Dashboard</h1>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded"
                  >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
  
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Enter stock symbol"
                  className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
  
                <StockData stockSymbol={symbol} />
              </div>
            }
          />
        </Route>
  
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </div>
  </Router>
  
  );
};

export default App;
