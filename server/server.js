require('dotenv').config();
const express = require('express'), cors = require('cors'), path = require('path');
const { connectDB } = require('./db');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/docs', require('./routes/docs'));
app.use((err, req, res, next) => res.status(400).json({ message: err.message || 'Server error' }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Admission Verify Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Fatal initialization error:', err);
});
