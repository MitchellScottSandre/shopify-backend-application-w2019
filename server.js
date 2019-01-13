const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());
app.use(require('./routes/index.routes'));

// Initial Message on web browser
app.get('/', (req, res) => {
  res.json({ message: 'Greetings! Checkout the README.md for sample operations to run!' });
});

// Let's us know app started successfully
app.listen(port, () => {
  console.log('Successfully running on port ' + port);
});
