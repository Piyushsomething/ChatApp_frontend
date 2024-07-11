"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Chat from '@/components/Chat';

const API_URL = 'https://chatapp-backend-uubf.onrender.com';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { token, userId } = response.data;
      setUser({ token, userId });
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleRegister = async (username, password) => {
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      alert('Registration successful. Please log in.');
      setIsRegistering(false);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Real-time Chat App
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {user ? (
            <Chat user={user} onLogout={handleLogout} />
          ) : isRegistering ? (
            <Register onRegister={handleRegister} onToggle={() => setIsRegistering(false)} />
          ) : (
            <Login onLogin={handleLogin} onToggle={() => setIsRegistering(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
