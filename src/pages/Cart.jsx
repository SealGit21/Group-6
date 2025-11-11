import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Image, Container, Row, Col, Alert } from 'react-bootstrap';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy userId từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserId(user.id);
      } catch (err) {
        console.error('Lỗi parsing user:', err);
      }
    }
  }, []);

  // Lấy giỏ hàng
  const fetchCart = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9999/carts?userId=${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:9999/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
      fetchProducts();
    }
  }, [userId]);

  useEffect(() => {
    const handleCartUpdated = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, [userId]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return sum;
      const price = product.salePrice ?? product.basePrice;
      return sum + price * item.quantity;
    }, 0);
  };

  const updateQuantity = async (item, newQty) => {
    try {
      if (newQty <= 0) {
        await axios.delete(`http://localhost:9999/carts/${item.id}`);
      } else {
        await axios.patch(`http://localhost:9999/carts/${item.id}`, { quantity: newQty });
      }
      fetchCart();
    } catch (err) {
      console.error('Lỗi khi cập nhật số lượng:', err);
    }
  };

  if (!userId) return <Alert variant="warning">Vui lòng đăng nhập để xem giỏ hàng</Alert>;
  if (loading) return <p>Đang tải giỏ hàng...</p>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Giỏ hàng của bạn</h2>

      {cartItems.length === 0 ? (
        <Alert variant="info">Chưa có sản phẩm nào trong giỏ hàng.</Alert>
      ) : (
        <>
          <Table responsive bordered hover>
            <thead className="table-dark text-center">
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Size</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                const price = product.salePrice ?? product.basePrice;
                return (
                  <tr key={item.id} className="align-middle text-center">
                    <td>
                      <Image src={product.image} width="80" rounded />
                    </td>
                    <td className="text-start">{product.name}</td>
                    <td>{item.size}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                      >−</Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                      >+</Button>
                    </td>
                    <td>{price.toLocaleString()}đ</td>
                    <td>{(price * item.quantity).toLocaleString()}đ</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateQuantity(item, 0)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Row className="justify-content-end mt-4">
            <Col xs="12" md="4" className="text-end">
              <h4>Tổng tiền: <span className="text-danger">{calculateTotal().toLocaleString()}đ</span></h4>
              <Button variant="success" size="lg" className="mt-3 w-100" onClick={() => navigate('/checkout')}>
                Thanh toán
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
