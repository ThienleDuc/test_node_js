const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const quyenHanRoutes = require('./routes/quyenHanRoutes');
const nguoiDungRoutes = require('./routes/nguoiDungRoutes')
const vaiTroRoutes = require('./routes/vaiTroRoutes')
const authRoutes = require('./routes/authRoutes');

const session = require('express-session');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  name: 'user_session',
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 giờ
  }
}));

app.use('/api/quyen-han', quyenHanRoutes);
app.use('/api/nguoi-dung', nguoiDungRoutes)
app.use('/api/vai-tro', vaiTroRoutes)
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
