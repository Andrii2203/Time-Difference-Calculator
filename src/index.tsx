import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChooseYourL1L2 from './chooseHale';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
if(rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ChooseYourL1L2 />
    </React.StrictMode>
  );
}


reportWebVitals();
