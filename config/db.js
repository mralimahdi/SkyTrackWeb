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
  tls: true,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
