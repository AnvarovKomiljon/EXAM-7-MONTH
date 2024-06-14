import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GeneralLayout from './pages/GeneralLayout/GeneralLayout';
import Category from './pages/Category/Category';
import Product from './pages/Product/Product';
import Login from './pages/Auth/Login/Login';
import PrivateRoute from './pages/PrivateRoute/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><GeneralLayout /></PrivateRoute>}>
        <Route path="category" element={<Category />} />
        <Route path="product" element={<Product />} />
      </Route>
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
