const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    owner: String,
    rating: [{ type: Number}],
    comments: [{type: String }],
    averageRating:{type:Number}
  
                   
  });

const BlogPost = mongoose.model('BlogPost',blogPostSchema);

blogPostSchema.index({ title: 'text', content: 'text' });
module.exports=BlogPost;