const express = require('express');
const jwt = require('jsonwebtoken');
const User= require('../UserModel')
const BlogPost= require('../BlogModel')

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

//routes to view all user
  router.get('/users', authenticateJWT('admin'),async (req, res) => {
    try {
      const users = await User.find({}, '_id username email role'); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //route to view all blogPost
  router.get('/blogposts',authenticateJWT('admin'), async (req, res) => {
    try {
      const blogPosts = await BlogPost.find();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // route to view particular blogPost
router.get('/blogposts/:id',authenticateJWT('admin'),async (req, res) => {
    const { id } = req.params;
  
    try {
      const blogPost = await BlogPost.findById(id);
      
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  module.exports=router;