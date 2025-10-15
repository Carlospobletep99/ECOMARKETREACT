import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import App from './App.jsx';
import { EcomarketProvider } from './context/EcomarketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EcomarketProvider>
        <App />
      </EcomarketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
