
const express = require('express');

const authRoutes = require('../routes/auth.routes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);






module.exports = app;
