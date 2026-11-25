import React from 'react';
import { createRoot } from 'react-dom/client';
import { setLanguage } from 'iztro/lib/i18n';
import App from './App.jsx';
import './styles.css';

// Nhãn giao diện của react-iztro đọc theo ngôn ngữ chung của iztro
setLanguage('vi-VN');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
