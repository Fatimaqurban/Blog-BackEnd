const express = require('express');
const jwt = require('jsonwebtoken');
const User= require('../UserModel')
const BlogPost= require('../BlogModel')

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

  router.post('/follow/:username', authenticateJWT('user'), (req, res) => {
    const { username } = req.params;
    const followerUsername = req.user.username;

    // Find the user to follow by the provided username
    User.findOne({ username })
        .then(userToFollow => {
            if (!userToFollow) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the follower's following array
            return User.findOneAndUpdate(
                { username: followerUsername },
                { $push: { following: userToFollow.username } }, // Add username to following array
                { new: true }
            )
                .then(updatedFollower => {
                    // Create the notification message
                    const notificationMessage = `${followerUsername} started following you`;

                    // Update the user being followed's notifications array
                    return User.findOneAndUpdate(
                        { username },
                        { $push: { notifications: notificationMessage } },
                        { new: true }
                    )
                        .then(updatedUserToFollow => res.json(updatedFollower))
                        .catch(err => res.status(500).json({ error: err.message }));
                })
                .catch(err => res.status(500).json({ error: err.message }));
        })
        .catch(err => res.status(500).json({ error: err.message }));
});



router.post('/unfollow/:username', authenticateJWT('user'), (req, res) => {
    const { username } = req.params;
    const followerUsername = req.user.username;

    // Find the user to follow by the provided username
    User.findOne({ username })
        .then(userToFollow => {
            if (!userToFollow) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the follower's following array
            return User.findOneAndUpdate(
                { username: followerUsername },
                { $pull: { following: userToFollow.username } }, // Add username to following array
                { new: true }
            )
                .then(updatedUser => res.json(updatedUser))
                .catch(err => res.status(500).json({ error: err.message }));
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/feed', authenticateJWT('user'), (req, res) => {
    const currentUserUsername = req.user.username;
    
    User.findOne({ username: currentUserUsername })
        .then(currentUser => {
            if (!currentUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            const followingUsernames = currentUser.following;

            return BlogPost.find({ owner: { $in: followingUsernames } });
        })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

router.get('/notifications', authenticateJWT('user'), (req, res) => {
    const currentUserUsername= req.user.username;
  
    User.findOne({ username: currentUserUsername })
      .then(user => res.json(user.notifications))
      .catch(err => res.status(500).json({ error: err.message }));
  });

module.exports= router;