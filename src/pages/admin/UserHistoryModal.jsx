import React, { useState, useEffect } from 'react';
import { Modal, Table, Badge, Spinner } from 'react-bootstrap';
import { api } from '../../services/api';

function UserHistoryModal({ show, onHide, user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && user) {
      fetchUserOrders();
    }
  }, [show, user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          Lịch sử mua hàng - {user?.name || 'N/A'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2">Đang tải...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Người dùng chưa có đơn hàng nào</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <strong>Tổng số đơn hàng:</strong> {orders.length} đơn
              <br />
              <strong>Tổng giá trị:</strong>{' '}
              {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('vi-VN')}đ
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Ngày đặt</th>
                  <th>Số lượng SP</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>{itemCount} sản phẩm</td>
                      <td className="fw-bold">{order.total.toLocaleString('vi-VN')}đ</td>
                      <td>{getPaymentStatusBadge(order.payment.status)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default UserHistoryModal;

