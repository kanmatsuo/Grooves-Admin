import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// core
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "primeflex/primeflex.css";
import './assets/css/style.css';

import '../src/assets/css/tailwind.css';
import '../src/assets/css/line.css';

import { GlobalServiceProvider } from "./GlobalServiceContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalServiceProvider>
      <App />
    </GlobalServiceProvider>
  </React.StrictMode>
)