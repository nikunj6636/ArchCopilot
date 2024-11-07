import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// This is the entry point of the React application. It renders the main App component to the DOM and sets up any global configurations or providers.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>  // used for developement mode, caused twice rendering tocheck for bugs
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();