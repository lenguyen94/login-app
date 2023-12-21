import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import './config';
// import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      // <GoogleOAuthProvider clientId={global.config.cliend_id}>
            <App />
      // </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
