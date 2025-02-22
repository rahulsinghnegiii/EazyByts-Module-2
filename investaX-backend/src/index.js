const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const stockRoutes = require("./routes/stockRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

console.log("🔹 Loading Portfolio Routes...");
app.use("/api/portfolio", portfolioRoutes);

console.log("📈 Loading Stock Routes...");
app.use("/api/stocks", stockRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
