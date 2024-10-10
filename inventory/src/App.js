import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import DashboardComponent from './components/DashboardComponent';
import ProductListComponent from './components/ProductListComponent';
import OrderListComponent from './components/OrderListComponent';
import ShopComponent from './components/ShopComponent';
import PlaceOrderComponent from './components/PlaceOrderComponent';
import Logout from './components/Logout'; // Import the Logout component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/shop" element={<ShopComponent />} />
        <Route path="/" element={<LoginComponent />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="/product" element={<ProductListComponent />} />
        <Route path="/order" element={<OrderListComponent />} />
        <Route path="/place-order" element={<PlaceOrderComponent />} />
        <Route path="/logout" element={<Logout />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
};

export default App;
