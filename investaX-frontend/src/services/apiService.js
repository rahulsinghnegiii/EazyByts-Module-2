import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/portfolio'; // Update if needed

// Get user's portfolio
export const getPortfolio = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

// Buy stocks
export const buyStock = async (token, stockSymbol, quantity) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/buy`,
      { stockSymbol, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error buying stock:', error);
    throw error;
  }
};

// Sell stocks
export const sellStock = async (token, stockSymbol, quantity) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sell`,
      { stockSymbol, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error selling stock:', error);
    throw error;
  }
};

// Get transaction history
export const getTransactions = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
