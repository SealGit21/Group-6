import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Detail from './pages/Detail';
import Products from './pages/Products';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

import { CartProvider } from './components/CartContext';
import Checkout from './pages/Checkout';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Listen to user changes (login/logout)
  useEffect(() => {
    const onUserChanged = (e) => {
      setUser(e.detail || JSON.parse(localStorage.getItem('user')) || null);
    };
    window.addEventListener('userChanged', onUserChanged);
    return () => window.removeEventListener('userChanged', onUserChanged);
  }, []);

  return (
    <Router>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">

          {/* Hiển thị AdminHeader nếu user là admin, ngược lại hiển thị Header thường */}
          {user && user.role === 'admin' ? <AdminHeader /> : <Header />}

          <div className="container mt-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<Detail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>

          <Footer />

        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
