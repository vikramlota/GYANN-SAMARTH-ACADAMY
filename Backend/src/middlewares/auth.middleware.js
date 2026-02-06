const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model.js');

const protect = async (req, res, next) => {
  let token;

  // LOG 1: What header did we get?
  console.log("------------------------------------------------");
  console.log("1. HEADERS RECEIVED:", req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // LOG 2: What is the token?
      console.log("2. TOKEN EXTRACTED:", token);
      
      // LOG 3: What is the secret?
      console.log("3. JWT SECRET IS:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("4. TOKEN DECODED:", decoded);

      req.admin = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error("5. VERIFICATION ERROR:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log("6. NO TOKEN FOUND");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };