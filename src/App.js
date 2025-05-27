import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://web-scraper-backend.onrender.com/scrape');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch data from backend');
    }
    setLoading(false);
  };

  const getChartData = () => {
    const priceRanges = {
      '£10-20': 0,
      '£20-30': 0,
      '£30-40': 0,
      '£40-50': 0,
      '£50-60': 0,
      '£60+': 0,
    };

    books.forEach(book => {
      const rawPrice = book.price?.replace('£', '').trim();
      const price = parseFloat(rawPrice);
      if (isNaN(price)) return;

      if (price <= 20) priceRanges['£10-20'] += 1;
      else if (price <= 30) priceRanges['£20-30'] += 1;
      else if (price <= 40) priceRanges['£30-40'] += 1;
      else if (price <= 50) priceRanges['£40-50'] += 1;
      else if (price <= 60) priceRanges['£50-60'] += 1;
      else priceRanges['£60+'] += 1;
    });

    const chartData = Object.entries(priceRanges).map(([range, count]) => ({ range, count }));
    console.log('📊 Chart Data:', chartData);
    return chartData;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📚 Book Titles and Prices</h1>
      <button onClick={fetchBooks} disabled={loading}>
        {loading ? 'Loading...' : 'Scrape Now'}
      </button>

      <table border="1" cellPadding="10" style={{ marginTop: 20, width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No data yet. Click "Scrape Now"</td>
            </tr>
          ) : (
            books.map((book, idx) => (
              <tr key={idx}>
                <td>{book.title}</td>
                <td>{book.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {books.length > 0 && (
        <>
          <h2 style={{ marginTop: 40 }}>📊 Price Distribution</h2>
          {/* Chart fallback: fixed size box to avoid ResponsiveContainer issues */}
          <div style={{ width: '100%', height: 300 }}>
            <BarChart width={600} height={300} data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </div>
        </>
      )}
    </div>
  );
}

export default App;




