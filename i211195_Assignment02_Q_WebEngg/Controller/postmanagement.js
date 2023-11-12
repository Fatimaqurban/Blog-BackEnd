const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const BlogPost= require('../BlogModel')
const User= require('../UserModel');

const router = express.Router();
const SECRET_KEY = 'Fast2021';


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

router.post('/post', authenticateJWT('user'), async(req, res) => {
    const { title, content} = req.body;
    const owner= req.user.username;
    const newPost = new BlogPost({ title, content, owner });
  
    newPost.save()
      .then(post => res.json(post))
      .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/posts', (req, res) => {
    const { page = 1, limit = 10} = req.query;
  
    BlogPost.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .then(posts => res.json(posts))
      .catch(err => res.status(500).json({ error: err.message }));
});


router.put('/post/:id', authenticateJWT('user'), (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const owner= req.user.username;

    BlogPost.findById(id)
   .then(existingBlogPost => {
    

    if (!existingBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (existingBlogPost.owner !== owner) {
      return res.status(401).json({ error: 'Unauthorized. Owner mismatch' });
    }

    BlogPost.findByIdAndUpdate(id, { title, content }, { new: true })
      .then(post => res.json(post))
      .catch(err => res.status(500).json({ error: err.message }));

  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

});

router.delete('/post/:id', authenticateJWT('user'),(req, res) => {
    const { id } = req.params;
    const owner= req.user.username;

    BlogPost.findById(id)
   .then(existingBlogPost => {
   

    if (!existingBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (existingBlogPost.owner !== owner) {
      return res.status(401).json({ error: 'Unauthorized. Owner mismatch' });
    }
    BlogPost.findByIdAndDelete(id)
      .then(() => res.json({message:"Your Blog Post has been Deleted" }))
      .catch(err => res.status(500).json({ error: err.message }));
   
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
});
    
});

router.post('/post/rate/:id', authenticateJWT('user'),(req, res) => {
  const { id } = req.params;
const { rating } = req.body;

BlogPost.findByIdAndUpdate(id, { $push: { rating: rating } }, { new: true })
  .then(updatedBlogPost => {
    const sum = updatedBlogPost.rating.reduce((total, rating) => total + rating, 0);
    updatedBlogPost.averageRating = sum / (updatedBlogPost.rating.length || 1); // Prevent division by zero
    return updatedBlogPost.save();
  })
  .then(post => res.json(post))
  .catch(err => res.status(500).json({ error: err.message }));

  });


  router.post('/post/comment/:id', authenticateJWT('user'), (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    let foundPost;

    BlogPost.findById(id)
        .then(post => {
          
            if (!post) {
                return res.status(404).json({ error: 'Blog post not found' });
            }

            // Update the blog post with the new comment
            post.comments.push(comment);
            foundPost = post; // Save the post in the variable for later use
            return post.save();
        })
        .then(() => {
            // Find the owner of the blog post
            return User.findOne({ username: foundPost.owner });
        })
        .then(owner => {
            if (!owner) {
                return res.status(404).json({ error: 'Blog post owner not found' });
            }

            // Create the notification message
            const notificationMessage = `${req.user.username} commented on your post titled: ${foundPost.title}`;

            // Update the owner's notifications array
            owner.notifications.push(notificationMessage);
            return owner.save();
        })
        .then(() => {
            res.json({ success: "comment has been posted"});
        })
        .catch(err => res.status(500).json({ error: err.message }));
});


module.exports = router;