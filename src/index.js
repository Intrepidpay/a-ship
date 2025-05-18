// Polyfills (MUST be first)
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

// Core imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';

// Debug polyfill status (safe to remove later)
console.log('Polyfills loaded:', {
  Promise: typeof Promise !== 'undefined',
  fetch: typeof fetch !== 'undefined',
  ObjectEntries: typeof Object.entries !== 'undefined',
  ReactVersion: React.version
});

// Crash protection for old browsers
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error) {
    this.setState({ hasError: true });
    console.error('App Crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 20,
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h2>⚠️ Browser Not Supported</h2>
          <p>Please use Chrome, Firefox, or Safari 14+</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Initialize React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);