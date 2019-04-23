const express = require('express');
const app = express();

const request = require('request');
const path = require('path');

/* use app folder for clients side code */
app.use(express.static(__dirname + '/app'));

app.get('/', (req, res) => {
  // path.join(__dirname, 'app/index.html')
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3030, () => console.log('Listening in on port 3030'));