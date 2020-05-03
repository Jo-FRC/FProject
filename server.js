const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect database
connectDB();

app.get('/', (req, res) => res.send('API running'))

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
