import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col } from 'react-bootstrap';
import { api } from '../services/api';

function AdminDashboard() {
  const [data, setData] = useState({
    products: [],
    orders: [],
    users: [],
    categories: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await api.getAllData();
        setData(allData);
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tính toán thống kê
  const totalRevenue = data.orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = data.products.length;
  const totalOrders = data.orders.length;
  const totalUsers = data.users.length;

  const getStatusBadge = (status) => {
    const statusMap = {
      'delivered': { bg: 'success', text: 'Đã giao' },
      'pending': { bg: 'warning', text: 'Chờ xử lý' },
      'shipping': { bg: 'info', text: 'Đang giao' },
      'cancelled': { bg: 'danger', text: 'Đã hủy' }
    };
    const s = statusMap[status] || { bg: 'secondary', text: status };
    return <Badge bg={s.bg}>{s.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    return status === 'paid' 
      ? <Badge bg="success">Đã thanh toán</Badge>
      : <Badge bg="warning">Chưa thanh toán</Badge>;
  };

  if (loading) {
    return <div className="text-center py-5"><h4>Đang tải...</h4></div>;
  }

  return (
    <div className="admin-dashboard">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {/* Thống kê tổng quan */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center" bg="primary" text="white">
            <Card.Body>
              <h3>{totalProducts}</h3>
              <p className="mb-0">Sản phẩm</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center" bg="success" text="white">
            <Card.Body>
              <h3>{totalOrders}</h3>
              <p className="mb-0">Đơn hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center" bg="info" text="white">
            <Card.Body>
              <h3>{totalUsers}</h3>
              <p className="mb-0">Người dùng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center" bg="warning" text="white">
            <Card.Body>
              <h3>{(totalRevenue / 1000000).toFixed(1)}M</h3>
              <p className="mb-0">Doanh thu (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Danh sách sản phẩm */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Quản lý Sản phẩm</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Giá gốc</th>
                <th>Giá sale</th>
                <th>Đánh giá</th>
                <th>Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map(product => {
                const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.basePrice.toLocaleString('vi-VN')}đ</td>
                    <td className="text-danger fw-bold">
                      {product.salePrice.toLocaleString('vi-VN')}đ
                    </td>
                    <td>{product.rating}</td>
                    <td>{totalStock} đôi</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Danh sách đơn hàng */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Quản lý Đơn hàng</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map(order => {
                const user = data.users.find(u => u.id === order.userId);
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{user?.name || 'N/A'}</td>
                    <td>{itemCount} sản phẩm</td>
                    <td className="fw-bold">{order.total.toLocaleString('vi-VN')}đ</td>
                    <td>{getPaymentStatusBadge(order.payment.status)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Danh sách người dùng */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Quản lý Người dùng</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Địa chỉ</th>
                <th>Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address || 'Chưa cập nhật'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Danh mục và Đánh giá */}
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Danh mục Sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên danh mục</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Đánh giá Sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Người dùng</th>
                    <th>Đánh giá</th>
                    <th>Nội dung</th>
                  </tr>
                </thead>
                <tbody>
                  {data.reviews.map(review => {
                    const product = data.products.find(p => p.id === review.productId);
                    const user = data.users.find(u => u.id === review.userId);
                    return (
                      <tr key={review.id}>
                        <td>{product?.name || 'N/A'}</td>
                        <td>{user?.name || 'N/A'}</td>
                        <td> {review.rating}</td>
                        <td>{review.comment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;

