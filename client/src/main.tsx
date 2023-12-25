import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './normalize.css';
import { CurrentPageContextProvider } from './components/CurrentPageContextProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrentPageContextProvider>
      <App />
    </CurrentPageContextProvider>
  </React.StrictMode>,
);
