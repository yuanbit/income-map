const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(express.static('public'));

app.get('/api-key', (req, res) => {
  //console.log(process.env.API_KEY); // Log the API key to the console
  res.send(process.env.API_KEY);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
