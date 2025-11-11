import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>

        <div className="d-flex flex-column min-vh-100">

          <Header />

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

    </Router>
  );
}

export default App;
