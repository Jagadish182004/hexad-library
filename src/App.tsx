import React from 'react';
import BookList from './components/BookList';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📚 Hexad Library Management</h1>
      <p>Welcome! View available books below:</p>
      <BookList />
    </div>
  );
};

export default App;