const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

// Only keep this one PORT line
const PORT = process.env.PORT || 5000;

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

