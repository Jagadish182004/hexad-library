import React from 'react';
import BookList from './components/BookList';
import BorrowForm from './components/BorrowForm';
import ReturnForm from './components/ReturnForm';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel'; // Phase 6
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { role } = useAuth();

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📚 Hexad Library Management</h1>
      <Login />

      {role ? (
        <>
          <p>Welcome, <strong>{role}</strong>! You can view, borrow, and return books below.</p>

          <section style={{ marginBottom: '2rem' }}>
            <BookList />
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <BorrowForm />
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <ReturnForm />
          </section>

          {role === 'admin' && (
            <section>
              <AdminPanel />
            </section>
          )}
        </>
      ) : (
        <p>Please log in to access library features.</p>
      )}
    </div>
  );
};

export default App;