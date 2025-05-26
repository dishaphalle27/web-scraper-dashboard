import React, { useState } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://web-scraper-backend.onrender.com/scrape'); // backend API URL
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch data from backend');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Book Titles and Prices</h1>
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
    </div>
  );
}

export default App;


