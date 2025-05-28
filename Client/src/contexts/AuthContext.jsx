import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else if (data.redirectTo) {
          navigate(data.redirectTo);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const login = async (userData) => {
    setUser(userData);
    navigate('/home');
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        if (data.redirectTo) {
          navigate(data.redirectTo);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};