const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  stocks: [
    {
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      purchasePrice: { type: Number, required: true },
      purchaseDate: { type: Date, default: Date.now },
    },
  ],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
