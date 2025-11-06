import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

function ProductFormModal({ 
  show, 
  onHide, 
  editMode, 
  formData, 
  categories,
  onInputChange,
  onSizeChange,
  onAddSize,
  onRemoveSize,
  onSubmit 
}) {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tên sản phẩm *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Thương hiệu *</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={onInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Danh mục *</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={onInputChange}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính *</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={onInputChange}
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Nam</option>
                  <option value="women">Nữ</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Đánh giá</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={onInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={onInputChange}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Giá gốc (VNĐ) *</Form.Label>
                <Form.Control
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={onInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Giá sale (VNĐ)</Form.Label>
                <Form.Control
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={onInputChange}
                  placeholder="Để trống nếu không sale"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Tags (phân cách bằng dấu phẩy)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onInputChange}
              placeholder="VD: running, speed, lightweight"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Màu sắc (phân cách bằng dấu phẩy) *</Form.Label>
            <Form.Control
              type="text"
              name="colors"
              value={formData.colors}
              onChange={onInputChange}
              placeholder="VD: white, black, blue"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Đường dẫn ảnh (phân cách bằng dấu phẩy) *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="images"
              value={formData.images}
              onChange={onInputChange}
              placeholder="VD: /images/products/shoe1.jpg, /images/products/shoe2.jpg"
              required
            />
            <Form.Text className="text-muted">
              Nhập đường dẫn đến ảnh trong thư mục public hoặc URL
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">Kích thước và Tồn kho *</Form.Label>
              <Button variant="success" size="sm" onClick={onAddSize} type="button">
                + Thêm size
              </Button>
            </div>
            {formData.sizes.map((sizeItem, index) => (
              <Row key={index} className="mb-2 align-items-center">
                <Col md={5}>
                  <Form.Control
                    type="number"
                    placeholder="Size"
                    value={sizeItem.size}
                    onChange={(e) => onSizeChange(index, 'size', e.target.value)}
                    required
                  />
                </Col>
                <Col md={5}>
                  <Form.Control
                    type="number"
                    placeholder="Số lượng"
                    value={sizeItem.stock}
                    onChange={(e) => onSizeChange(index, 'stock', e.target.value)}
                    required
                  />
                </Col>
                <Col md={2}>
                  <Button 
                    variant="danger" 
                    size="sm"
                    type="button"
                    onClick={() => onRemoveSize(index)}
                    disabled={formData.sizes.length === 1}
                  >
                    Xóa
                  </Button>
                </Col>
              </Row>
            ))}
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

export default ProductFormModal;

