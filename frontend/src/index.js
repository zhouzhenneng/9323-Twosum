import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import LoginPage from './Component/LoginPage';
import RegisterPage from './Component/RegisterPage';
import HomePage from './Component/HomePage';
import 'antd/dist/antd.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  {/* <TwoSumHeader/> */}
  <BrowserRouter>
    <App/>
  </BrowserRouter>
  {/* <TwoSumFooter/> */}
  </>
);
