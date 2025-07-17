import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import OpenAIChat from './OpenAIChat';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [chatOpen, setChatOpen] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load OpenAI key into window for runtime usage (as a workaround for create-react-app .env limitations)
  useEffect(() => {
    if (!window.REACT_APP_OPENAI_API_KEY && process.env.REACT_APP_OPENAI_API_KEY) {
      window.REACT_APP_OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    }
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const toggleChat = () => {
    setChatOpen(val => !val);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {/* Floating OpenAI chat button */}
      <button
        aria-label="Open Tic Tac Toe Assistant"
        style={{
          position: "fixed",
          right: 30,
          bottom: chatOpen ? 320 : 36,
          zIndex: 999,
          background: "var(--button-bg, #007bff)",
          color: "var(--button-text, #fff)",
          border: "none",
          borderRadius: "50%",
          width: 58,
          height: 58,
          fontSize: 28,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          cursor: "pointer",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "box-shadow 0.2s,bottom 0.25s"
        }}
        onClick={toggleChat}
      >
        💬
      </button>
      {chatOpen && (
        <OpenAIChat onClose={toggleChat} />
      )}
    </div>
  );
}

export default App;
