const express = require('express');
const cors = require('cors');
var mysql = require('mysql');
let config = require('./config.js');
let connection = mysql.createConnection(config);
require('dotenv').config();


const app = express();
const port = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());



connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.listen(port ,() => {
    console.log(`server is running on port : ${port}`);
});

const userrouter = require('./routes/users');


app.use('/users',userrouter);