import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 
  const ADMIN_PASSWORD = '';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setError('');
      onLogin(true);
    } else {
      setError('Contraseña incorrecta. Acceso denegado.');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>🔒 Acceso de Administración</h2>
        <p className="login-subtitle">Ingresa la contraseña para acceder al panel de administración</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Ingresa la contraseña"
              required
              autoFocus
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="login-btn">
            Ingresar
          </button>
        </form>
        
        <p className="login-note">
          ⚠️ Solo personal autorizado puede acceder a esta sección
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

