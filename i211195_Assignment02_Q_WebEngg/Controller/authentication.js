const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User= require('../UserModel')

const router = express.Router();
const SECRET_KEY = 'Fast2021';



// Middleware to check if the request has a valid JWT token
const authenticateJWT = (requiredRole) => (req, res, next) => {
    const token = req.headers.token;

    if (!token)
     return res.status(401).json({ message: 'Unauthorized' });
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err)
       return res.status(403).json({ message: 'Forbidden' });
  
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden. Insufficient privileges.' });
      }
  
      req.user = user;
      next();
    });
  };
  

// Register a new user
router.post('/register',  async (req, res) => {

  const { username, email, password, role} = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashedPassword, role:role });
  await user.save();

  res.status(201).json({ message: 'User registered successfully!' });
});

// Login and generate JWT token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
 
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY);
  res.json({ token });
});

// Get user profile (requires authentication)
router.get('/userprofile', authenticateJWT('user'), (req, res) => {
  const { username, role } = req.user;
  res.json({ username, role });
});

// Get admin profile (requires authentication)
router.get('/adminprofile', authenticateJWT('admin'), (req, res) => {
    const { username, role } = req.user;
    res.json({ username, role });
  });

// Update user profile (requires authentication)
router.put('/userprofile', authenticateJWT('user'), async (req, res) => {
    const { username } = req.user;
    const { email, password } = req.body;
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $set: { email, password: hashedPassword } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: `Profile updated for user: ${username}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
/// Update admin profile (requires authentication)
router.put('/adminprofile', authenticateJWT('admin'), async (req, res) => {
    const { username } = req.user;
    const { email, password } = req.body;
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $set: { email, password: hashedPassword } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: `Profile updated for user: ${username}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
module.exports = router;
