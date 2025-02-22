const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  console.log('Auth Middleware Hit');
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      req.user = { id: decoded.userId }; 
      return next();  // Ensure we exit function properly
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  console.log('No token provided');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
