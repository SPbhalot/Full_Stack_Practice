const express = require('express');
const app= express()
const auth = require('../backend/auth')
const mongoose= require('mongoose');
const bodyParser = require('body-parser')
mongoose.connect('mongodb://127.0.0.1:27017/work', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/auth',auth)
app.listen(5000,()=>{
    console.log("server is running on port 5000")
})