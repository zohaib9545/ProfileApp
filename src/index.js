const express = require("express");
const connect = require("./database/connection");
const router = require('./routes/profileRoutes');
const port = 3000;
const host = "localhost";
const app = express();

app.use(express.json()); // Middleware to parse JSON in requests

app.use('/api', router); // Assuming you want to prefix routes with "/api"

// Route handler for the root path ("/")
app.get('/', (req, res) => {
    res.send("Welcome to the root path!");
});

app.listen(port, () => {
  console.log(`Server listening at http://${host}:${port}`);
  connect();
  console.log('Socket.io server is running');
});
