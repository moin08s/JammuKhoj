import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/Router';
import { ErrorBoundary } from './ui/ErrorBoundary';
import './i18n/config';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </React.StrictMode>
);
