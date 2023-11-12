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
       return res.status(403).json({ message: 'Forbidden' });// if token is wrong
  
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden. Insufficient privileges.' });
      }
  
      req.user = user;
      next();
    });
  };

  router.get('/blog', authenticateJWT('user'), (req, res) => {
    const { keywords, authors, sortBy, sortOrder } = req.query;

    let query = {};
    if (keywords) {
        const keywordArray = keywords.split(' ');
        const keywordRegexArray = keywordArray.map(keyword => new RegExp(keyword, 'i'));
        query.$or = [
            { title: { $in: keywordRegexArray } },
            { content: { $in: keywordRegexArray } }
        ];
    }
    if (authors) {
        query.owner = { $in: authors.split(' ') };
    }

    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    BlogPost.find(query)
        .sort(sortOptions)
        .exec()
        .then(searchResults => {
            res.json(searchResults);
        })
        .catch(error => {
            handleErrorResponse(res, error);
        });
});

function handleErrorResponse(res, error) {
    res.status(500).json({ error: error.message });
}
module.exports=router;