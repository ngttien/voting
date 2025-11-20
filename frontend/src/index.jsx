import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { VotingFactoryProvider } from './context/VotingFactoryContext';
import App from './App.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <VotingFactoryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </VotingFactoryProvider>
  </React.StrictMode>
);

