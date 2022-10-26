import React from 'react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

import './index.css';
import App from './pages/App.js';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

document.title = "WhatsApp";

root.render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          />
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);


/* 
a
            
*/
