import React from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, logout, role } = useAuth();

  return (
    <div style={{ marginBottom: '1rem' }}>
      {role ? (
        <>
          <p>Logged in as: <strong>{role}</strong></p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p>Select Role to Login:</p>
          <button onClick={() => login('user')}>Login as User</button>
          <button onClick={() => login('admin')}>Login as Admin</button>
        </>
      )}
    </div>
  );
};

export default Login;