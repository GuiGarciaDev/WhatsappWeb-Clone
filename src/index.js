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
# 13/10
 First tentative to implement firebase
 Created firebase project 

# 14/40
 Added Login and Register page
 Added React Router to move through pages

# 16/10
 Added Firebase Auth
 Register/login with email and password
 Added PrivateRoute to auth
 
# 17/10
 Added reset password and profile update
 Need to do db provider 

 # 18/10
  Left Column is now listening db

 # 19/10
  Right Column is now listening db
  Need to make the functions work again
            
*/
