const express = require('express');
const app = express();
const port = 9000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});