import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // Import the CSS
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials or server error.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-header">Admin Login</div>

      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-container">
            <button type="submit" className="login-button">Sign In</button>           
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
