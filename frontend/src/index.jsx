import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure this matches the location and extension of your App component
import './style.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
