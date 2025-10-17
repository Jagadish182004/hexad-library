import React from 'react';
import BookList from './components/BookList';
import BorrowForm from './components/BorrowForm';
import ReturnForm from './components/ReturnForm';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📚 Hexad Library Management</h1>
      <p>Welcome! You can view, borrow, and return books below.</p>

      <section style={{ marginBottom: '2rem' }}>
        <BookList />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <BorrowForm />
      </section>

      <section>
        <ReturnForm />
      </section>
    </div>
  );
};

export default App;