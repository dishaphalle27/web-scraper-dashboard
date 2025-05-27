
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const rateLimit = require('express-rate-limit')

const app = express();

// ✅ Add your updated CORS config here
app.use(cors({
  origin: 'https://web-scraper-dashboard.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,              // limit each IP to 5 requests per minute
  message: '🚫 Too many requests. Please try again later.',
});

// Apply rate limiter only to the /scrape route
app.use('/scrape', limiter);


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Web Scraper API! Use /scrape to fetch data.');
});

// Scrape route
app.get('/scrape', async (req, res) => {
  try {
    const response = await axios.get('https://books.toscrape.com/');
    const html = response.data;
    const $ = cheerio.load(html);
    const books = [];

    $('.product_pod').each((index, element) => {
      const title = $(element).find('h3 a').attr('title');
      const price = $(element).find('.price_color').text();
      books.push({ title, price });
    });

    res.json(books);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Use Render's dynamic port or 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


