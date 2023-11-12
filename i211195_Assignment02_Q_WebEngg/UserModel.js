const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    following:[{type:String}],
    notifications:[{type:String}],
  
                   
  });
  
  //User Model
  const User = mongoose.model('User', userSchema);

module.exports= User;