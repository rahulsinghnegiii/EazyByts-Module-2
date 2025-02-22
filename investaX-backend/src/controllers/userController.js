const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Login user & generate JWT
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with user details
    const token = jwt.sign(
      { user: { id: user._id, name: user.name } },  // Add necessary details to the payload
      process.env.JWT_SECRET,  // Use the secret key from .env
      { expiresIn: '30d' }     // Token expiration (optional, e.g., 30 days)
    );

    // Send the token in the response
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };
