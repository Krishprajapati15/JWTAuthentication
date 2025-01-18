const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');  
                                    
const app = express();       
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/jwtAuth', { })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', routes);


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});