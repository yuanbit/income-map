const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(express.static('public'));

// Add a new route that returns the API key
app.get('/api-key', (req, res) => {
  res.send(process.env.API_KEY);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
