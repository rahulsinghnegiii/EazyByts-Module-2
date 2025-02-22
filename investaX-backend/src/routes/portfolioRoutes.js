const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getPortfolio,
  buyStock,
  sellStock,
} = require('../controllers/portfolioController');

const router = express.Router();


router.get('/test', (req, res) => {
  res.json({ message: 'Portfolio API is working' });
});


// Get user's portfolio
router.get('/', protect, getPortfolio);

// Buy stock
router.post('/buy', protect, buyStock);

// Sell stock
router.post('/sell', protect, sellStock);

module.exports = router;
