import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Alert,
  Badge
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUserAndOrders();
  }, []);

  const loadUserAndOrders = async () => {
    try {
      // Get current user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      
      // Fetch fresh user data and their orders
      const [freshUserData, allOrders] = await Promise.all([
        api.getUsers().then(users => 
          users.find(u => u.email?.toLowerCase() === userData.email?.toLowerCase())
        ),
        api.getAllData().then(data => data.orders || [])
      ]);

      if (!freshUserData) {
        throw new Error('User not found');
      }

      setUser(freshUserData);
      setEditForm(freshUserData);

      // Filter orders for this user
      const userOrders = allOrders.filter(order => order.userId === freshUserData.id);
      setOrders(userOrders);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Không thể tải thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditForm({ ...user });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      // Update user in database
      await api.updateUser(user.id, {
        ...user,
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address
      });

      // Update local state and localStorage
      const updatedUser = {
        ...user,
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address
      };
      setUser(updatedUser);
      
      // Update localStorage and notify header
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userChanged', { detail: updatedUser }));

      setSuccess('Cập nhật thông tin thành công!');
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">Đang tải...</div>
      </Container>
    );
  }

  // Kiểm tra nếu user null
  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Không tìm thấy thông tin người dùng. Vui lòng <Alert.Link href="/login">đăng nhập</Alert.Link> lại.
        </Alert>
      </Container>
    );
  }

  // Kiểm tra nếu là admin
  if (user.role === 'admin') {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Tài khoản Admin không có trang Profile. Vui lòng truy cập <Alert.Link href="/admin">Admin Panel</Alert.Link>.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title className="mb-4">Thông tin cá nhân</Card.Title>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {editing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={editForm.phone || ''}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={editForm.address || ''}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ"
                      rows={3}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary">
                      Lưu thay đổi
                    </Button>
                    <Button type="button" variant="outline-secondary" onClick={handleCancel}>
                      Hủy
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <dl className="mb-4">
                    <dt>Họ và tên</dt>
                    <dd>{user.name || '(Chưa cập nhật)'}</dd>

                    <dt>Email</dt>
                    <dd>{user.email}</dd>

                    <dt>Số điện thoại</dt>
                    <dd>{user.phone || '(Chưa cập nhật)'}</dd>

                    <dt>Địa chỉ</dt>
                    <dd>{user.address || '(Chưa cập nhật)'}</dd>
                  </dl>

                  <Button variant="outline-primary" onClick={handleEdit}>
                    Chỉnh sửa thông tin
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4">Lịch sử đơn hàng</Card.Title>

              {orders.length === 0 ? (
                <p className="text-muted">Bạn chưa có đơn hàng nào.</p>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>{order.total?.toLocaleString('vi-VN')}đ</td>
                          <td>
                            <Badge bg={
                              order.status === 'delivered' ? 'success' :
                              order.status === 'processing' ? 'warning' :
                              order.status === 'cancelled' ? 'danger' : 
                              'secondary'
                            }>
                              {order.status === 'delivered' ? 'Đã giao' :
                               order.status === 'processing' ? 'Đang xử lý' :
                               order.status === 'cancelled' ? 'Đã hủy' :
                               order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
