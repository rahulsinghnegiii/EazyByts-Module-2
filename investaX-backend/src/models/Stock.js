import mongoose from 'mongoose';

const stockSchema = mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Add other stock-related data like market cap, volume, etc. if needed
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
