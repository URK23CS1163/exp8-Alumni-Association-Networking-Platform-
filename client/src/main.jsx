import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import AuthLanding from './components/AuthLanding';
import Forgot from './components/Forgot';
import Reset from './components/Reset';
import Verify from './components/Verify';
import DevMailbox from './components/DevMailbox';
import './styles.css';

function Protected({ children }){
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path='/' element={<AuthLanding/>} />
        <Route path='/home' element={<Protected><App/></Protected>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/forgot' element={<Forgot/>} />
        <Route path='/reset' element={<Reset/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/dev-mailbox' element={<DevMailbox/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
