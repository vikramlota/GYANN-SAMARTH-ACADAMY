const Admin = require('../models/Admin.model.js');
const generateToken = require('../utils/generateToken.js');
const bcrypt = require('bcrypt');

// @desc    Auth Admin & Get Token
// @route   POST /api/admin/login
const authAdmin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register Admin (Dev only)
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await Admin.create({ username, password: hashedPassword });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid data' });
  }
};

module.exports = { authAdmin, registerAdmin };