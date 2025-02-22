const express = require('express');
const { loginUser } = require('../controllers/userController');

const router = express.Router();

// Route to login user
router.post('/login', loginUser);

module.exports = router;
