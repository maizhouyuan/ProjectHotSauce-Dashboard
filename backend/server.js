const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

// Express app setup
const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());

// Use the routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});