import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
// import App from './App';
import TimeDifferenceCalculator from './TimeDifferenceCalculator';

const rootElement = document.getElementById('root');
if(rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <TimeDifferenceCalculator />
    </React.StrictMode>
  );
}


reportWebVitals();
