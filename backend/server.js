require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const toolRoutes = require('./routes/tools');
const recipeRoutes = require('./routes/recipes');
const adminRoutes = require('./routes/admins');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://it23817876:gtFBM6SBnoUogpEf@cluster0.kmidshm.mongodb.net/chef_academy?retryWrites=true&w=majority';

// Attempt MongoDB connection without blocking server start
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Health endpoint
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ ok: true, dbState: state });
});

// Users routes
app.use('/users', userRoutes);
app.use('/tools', toolRoutes);
app.use('/recipes', recipeRoutes);
app.use('/admins', adminRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});






// DB connection is handled above; server starts independently
