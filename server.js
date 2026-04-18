const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

dotenv.config();

const db = require('./config/db');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const agentRouter = require('./routes/agent');
const trackRouter = require('./routes/track');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/traffic_redirect',
      collectionName: 'sessions',
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use((req, res, next) => {
  req.session.user = req.session.user;
  req.session.role = req.session.role;
  next();
});

mongoose.connection.once('connected', async () => {
  try {
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('Admin@123', 10);
      await Admin.create({
        username: 'admin',
        email: 'admin@example.com',
        passwordHash,
      });
      console.log('Default admin created: admin / Admin@123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
});

app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/agent', agentRouter);
app.use('/r', trackRouter);

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Traffic platform running on http://localhost:${PORT}`);
});
