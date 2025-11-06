import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function CategoryFormModal({ 
  show, 
  onHide, 
  editMode, 
  formData, 
  onInputChange, 
  onSubmit 
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Sửa danh mục' : 'Thêm danh mục mới'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục *</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={onInputChange}
              placeholder="VD: Running, Casual, Boots..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} type="button">
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            {editMode ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CategoryFormModal;

