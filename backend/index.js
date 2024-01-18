const express = require('express');
const app= express()
const auth = require('../backend/auth')
const mongoose= require('mongoose');
const bodyParser = require('body-parser')
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cors = require('cors');


app.use(express.static(__dirname + '/node_modules'));
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


  io.on('connection', function(client) {

  console.log('Client connected...');
    client.on('join', function(data) {
      console.log(data);
    });
    client.on('msg',(data)=>{
    console.log(data)
  })

    
    
});
   
app.use(cors());
app.get('/', function(req, res,next) {
  res.sendFile(__dirname + '/index.html');
});
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/auth',auth)
server.listen(5000,()=>{
    console.log("server is running on port 5000")
})