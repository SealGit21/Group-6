import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function OrderFormModal({ 
  show, 
  onHide, 
  order, 
  users,
  formData, 
  onInputChange, 
  onSubmit 
}) {
  if (!order) return null;

  const user = users.find(u => u.id === order.userId);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật Đơn hàng #{order.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Khách hàng</Form.Label>
            <Form.Control 
              type="text" 
              value={user?.name || 'N/A'} 
              disabled 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tổng tiền</Form.Label>
            <Form.Control 
              type="text" 
              value={order.total.toLocaleString('vi-VN') + 'đ'} 
              disabled 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái thanh toán</Form.Label>
            <Form.Select 
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={onInputChange}
              required
            >
              <option value="pending">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái đơn hàng</Form.Label>
            <Form.Select 
              name="status"
              value={formData.status}
              onChange={onInputChange}
              required
            >
              <option value="pending">Chờ xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default OrderFormModal;

