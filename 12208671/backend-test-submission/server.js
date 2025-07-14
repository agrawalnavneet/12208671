
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener';
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}/`;

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
async function log(stack, level, pkg, message, token) {
  try {
    const body = JSON.stringify({ stack, level, package: pkg, message });
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const fetch = (await import('node-fetch')).default;
    await fetch(LOG_API_URL, { method: 'POST', headers, body });
  } catch (err) {}
}

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

const shortUrlSchema = new mongoose.Schema({
  full_url: String,
  short_url: { type: String, unique: true, index: true },
  clicks: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  expiry: Date,
  clickDetails: [
    {
      timestamp: Date,
      referrer: String,
      geo: String,
    },
  ],
});
const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    log('backend', 'info', 'db', `MongoDB Connected: ${MONGO_URI}`);
    app.listen(PORT, () => {
      log('backend', 'info', 'service', `Server running on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    log('backend', 'fatal', 'db', `MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
})();


function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


app.post('/shorturls', async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url) {
      log('backend', 'error', 'handler', 'No URL provided');
      return res.status(400).json({ error: 'URL is required' });
    }
    let code = shortcode || generateShortcode();
   
    let exists = await ShortUrl.findOne({ short_url: code });
    if (exists) {
      log('backend', 'error', 'handler', 'Shortcode already exists');
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
    const expiry = new Date(Date.now() + validity * 60000);
    const shortUrl = new ShortUrl({
      full_url: url,
      short_url: code,
      expiry,
    });
    await shortUrl.save();
    log('backend', 'info', 'controller', `Short URL created: ${code}`);
    res.status(201).json({ shortLink: APP_URL + code, expiry: expiry.toISOString() });
  } catch (err) {
    log('backend', 'fatal', 'handler', `Error creating short URL: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect
app.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await ShortUrl.findOne({ short_url: shortcode });
    if (!urlDoc) {
      log('backend', 'error', 'controller', 'Short URL not found');
      return res.status(404).json({ error: 'Short URL not found' });
    }
    if (urlDoc.expiry && urlDoc.expiry < new Date()) {
      log('backend', 'error', 'controller', 'Short URL expired');
      return res.status(410).json({ error: 'Short URL expired' });
    }
    // Log click
    urlDoc.clicks += 1;
    urlDoc.clickDetails.push({
      timestamp: new Date(),
      referrer: req.get('referer') || '',
      geo: req.ip || '',
    });
    await urlDoc.save();
    log('backend', 'info', 'controller', `Redirected: ${shortcode}`);
    res.redirect(urlDoc.full_url);
  } catch (err) {
    log('backend', 'fatal', 'handler', `Error redirecting: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Stats
app.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await ShortUrl.findOne({ short_url: shortcode });
    if (!urlDoc) {
      log('backend', 'error', 'controller', 'Short URL not found for stats');
      return res.status(404).json({ error: 'Short URL not found' });
    }
    res.json({
      originalUrl: urlDoc.full_url,
      createdAt: urlDoc.createdAt,
      expiry: urlDoc.expiry,
      clicks: urlDoc.clicks,
      clickDetails: urlDoc.clickDetails,
    });
  } catch (err) {
    log('backend', 'fatal', 'handler', `Error getting stats: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 