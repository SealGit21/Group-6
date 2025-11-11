import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';

export default function Checkout({ userId }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '' });

  // Lấy userId từ localStorage nếu chưa có
  const uid = userId || JSON.parse(localStorage.getItem('user') || '{}')?.id;

  // Fetch giỏ hàng và sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      if (!uid) {
        setAlert({ show: true, message: 'Vui lòng đăng nhập để thanh toán' });
        setLoading(false);
        return;
      }
      try {
        const cartRes = await axios.get(`http://localhost:9999/carts?userId=${uid}`);
        setCartItems(cartRes.data);

        const prodRes = await axios.get('http://localhost:9999/products');
        setProducts(prodRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlert({ show: true, message: 'Lỗi khi lấy dữ liệu' });
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return sum;
      const price = product.salePrice ?? product.basePrice;
      return sum + price * item.quantity;
    }, 0) + 30000;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      setAlert({ show: true, message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    try {
      const orderData = {
        userId: uid,
        items: cartItems.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
        subtotal: calculateTotal() - 30000,
        shipping: 30000,
        total: calculateTotal(),
        shippingAddress: form.address,
        payment: { method: paymentMethod, status: paymentMethod === 'qr' ? 'paid' : 'unpaid' },
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await axios.post('http://localhost:9999/orders', orderData);

      // Xóa cart trên server
      await Promise.all(cartItems.map(item => axios.delete(`http://localhost:9999/carts/${item.id}`)));
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: 'Có lỗi khi tạo đơn hàng' });
    }
  };

  if (loading) return <Container className="py-5">Đang tải...</Container>;

  if (success) {
    return (
      <Container className="py-5 text-center">
        <h3>Đặt hàng thành công!</h3>
        <Button className="mt-3" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Thanh toán</h1>
      {alert.show && <Alert variant="danger" onClose={() => setAlert({ show: false, message: '' })} dismissible>{alert.message}</Alert>}
      <Row>
        <Col md={6}>
          <Card className="p-3 mb-4">
            <h5>Thông tin giao hàng</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="Họ và tên" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" value={form.email} onChange={handleChange} placeholder="Email" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" />
              </Form.Group>

              <h5 className="mt-4">Phương thức thanh toán</h5>
              <Form.Check type="radio" label="COD" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <Form.Check type="radio" label="QR" name="payment" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} />

              <Button type="submit" className="mt-3" variant="primary">Xác nhận thanh toán</Button>
            </Form>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 mb-4">
            <h5>Giỏ hàng</h5>
            {cartItems.length === 0 ? (
              <Alert variant="info">Giỏ hàng trống</Alert>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  const price = product.salePrice ?? product.basePrice;
                  return (
                    <ListGroup.Item key={item.id} className="d-flex justify-content-between">
                      <div>{product.name} ({item.size}) x {item.quantity}</div>
                      <div>{(price * item.quantity).toLocaleString()}đ</div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            )}
            {cartItems.length > 0 && (
              <>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Tạm tính:</strong>
                  <span>{(calculateTotal() - 30000).toLocaleString()}đ</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Phí vận chuyển:</strong>
                  <span>30,000đ</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Tổng cộng:</strong>
                  <span>{calculateTotal().toLocaleString()}đ</span>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
