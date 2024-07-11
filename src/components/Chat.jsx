// File: src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = 'https://chatapp-backend-uubf.onrender.com';

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${user.userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    const socket = new WebSocket(`ws://localhost:3000`);
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user.token, user.userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && ws) {
      const message = {
        content: newMessage,
        userId: user.userId,
        isFromServer: false,
      };
      ws.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Your Chat with Server</h3>
        <button
          onClick={onLogout}
          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isFromServer ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.isFromServer
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm font-bold mb-1">
                {message.isFromServer ? 'Server' : 'You'}
              </p>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;