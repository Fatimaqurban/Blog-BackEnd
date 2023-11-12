const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authenticationRoutes = require('./Controller/authentication');
const blogPostsRoutes= require('./Controller/postmanagement');
const interactionRoutes= require('./Controller/userinteraction');
const searchRoutes=require('./Controller/search');
const adminRoutes=require('./Controller/admin');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://i211195:Fast2021@cluster10.2zneqma.mongodb.net/?retryWrites=true&w=majority');

app.use(bodyParser.json());

// Main route
app.get('/', (req, res) => {
  res.send('Main route!');
});

//  routes
app.use('/auth', authenticationRoutes);
app.use('/blog', blogPostsRoutes);
app.use('/interaction',interactionRoutes);
app.use('/search',searchRoutes);
app.use('/admin',adminRoutes);

//

app.listen(PORT, () => {
  console.log(`Server is running on 3000`);
});
