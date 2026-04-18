const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('strictQuery', false);

const mongodbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/traffic_redirect';
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Using local fallback for development only.');
}

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
