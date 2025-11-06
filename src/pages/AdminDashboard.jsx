import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col, Button, Alert, Nav } from 'react-bootstrap';
import { api } from '../services/api';
import ProductFormModal from './admin/ProductFormModal';
import CategoryFormModal from './admin/CategoryFormModal';
import UserHistoryModal from './admin/UserHistoryModal';

function AdminDashboard() {
  const [data, setData] = useState({
    products: [],
    orders: [],
    users: [],
    categories: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProductMode, setEditProductMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    categoryId: '',
    gender: 'unisex',
    description: '',
    basePrice: '',
    salePrice: '',
    rating: 4.5,
    tags: '',
    colors: '',
    images: '',
    sizes: [{ size: 38, stock: 0 }]
  });

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategoryMode, setEditCategoryMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  // User History Modal State
  const [showUserHistoryModal, setShowUserHistoryModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Alert State
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allData = await api.getAllData();
      setData(allData);
    } catch (error) {
      console.error('Lỗi:', error);
      showAlert('danger', 'Không thể tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // ========== PRODUCT CRUD HANDLERS ==========
  const handleShowProductModal = (product = null) => {
    if (product) {
      setEditProductMode(true);
      setCurrentProduct(product);
      setProductForm({
        name: product.name,
        brand: product.brand,
        categoryId: product.categoryId,
        gender: product.gender,
        description: product.description,
        basePrice: product.basePrice,
        salePrice: product.salePrice || '',
        rating: product.rating,
        tags: product.tags.join(', '),
        colors: product.colors.join(', '),
        images: product.images.join(', '),
        sizes: product.sizes
      });
    } else {
      setEditProductMode(false);
      setCurrentProduct(null);
      setProductForm({
        name: '',
        brand: '',
        categoryId: '',
        gender: 'unisex',
        description: '',
        basePrice: '',
        salePrice: '',
        rating: 4.5,
        tags: '',
        colors: '',
        images: '',
        sizes: [{ size: 38, stock: 0 }]
      });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: productForm.name,
        brand: productForm.brand,
        categoryId: parseInt(productForm.categoryId),
        gender: productForm.gender,
        description: productForm.description,
        basePrice: parseInt(productForm.basePrice),
        salePrice: productForm.salePrice ? parseInt(productForm.salePrice) : null,
        rating: parseFloat(productForm.rating),
        tags: productForm.tags.split(',').map(t => t.trim()).filter(t => t),
        colors: productForm.colors.split(',').map(c => c.trim()).filter(c => c),
        images: productForm.images.split(',').map(i => i.trim()).filter(i => i),
        sizes: productForm.sizes,
        createdAt: editProductMode ? currentProduct.createdAt : new Date().toISOString().split('T')[0]
      };

      if (editProductMode) {
        await api.updateProduct(currentProduct.id, productData);
        showAlert('success', 'Cập nhật sản phẩm thành công!');
      } else {
        await api.createProduct(productData);
        showAlert('success', 'Thêm sản phẩm thành công!');
      }

      setShowProductModal(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi:', error);
      showAlert('danger', 'Có lỗi xảy ra khi lưu sản phẩm!');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await api.deleteProduct(id);
        showAlert('success', 'Xóa sản phẩm thành công!');
        fetchData();
      } catch (error) {
        console.error('Lỗi:', error);
        showAlert('danger', 'Không thể xóa sản phẩm!');
      }
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...productForm.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'stock' || field === 'size' ? parseInt(value) || 0 : value
    };
    setProductForm(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSizeRow = () => {
    setProductForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: 39, stock: 0 }]
    }));
  };

  const removeSizeRow = (index) => {
    if (productForm.sizes.length > 1) {
      setProductForm(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }));
    }
  };

  // ========== USER MANAGEMENT HANDLERS ==========
  const handleShowUserHistory = (user) => {
    setCurrentUser(user);
    setShowUserHistoryModal(true);
  };

  // ========== CATEGORY CRUD HANDLERS ==========
  const handleShowCategoryModal = (category = null) => {
    if (category) {
      setEditCategoryMode(true);
      setCurrentCategory(category);
      setCategoryForm({ name: category.name });
    } else {
      setEditCategoryMode(false);
      setCurrentCategory(null);
      setCategoryForm({ name: '' });
    }
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategoryMode) {
        await api.updateCategory(currentCategory.id, categoryForm);
        showAlert('success', 'Cập nhật danh mục thành công!');
      } else {
        await api.createCategory(categoryForm);
        showAlert('success', 'Thêm danh mục thành công!');
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi:', error);
      showAlert('danger', 'Có lỗi xảy ra!');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await api.deleteCategory(id);
        showAlert('success', 'Xóa danh mục thành công!');
        fetchData();
      } catch (error) {
        console.error('Lỗi:', error);
        showAlert('danger', 'Không thể xóa danh mục!');
      }
    }
  };

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
     
      {/*alert*/}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="overview">Tổng quan</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="products">Sản phẩm</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="orders">Đơn hàng</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="users">Người dùng</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="categories">Danh mục & Đánh giá</Nav.Link>
        </Nav.Item>
      </Nav>
    
      {/*thong ke*/}
      {activeTab === 'overview' && (
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
      )}

      {/*danh sach san pham*/}
      {activeTab === 'products' && (
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Quản lý Sản phẩm</h5>
          <Button variant="primary" size="sm" onClick={() => handleShowProductModal()}>
            + Thêm sản phẩm
          </Button>
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
                <th>Thao tác</th>
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
                      {product.salePrice ? product.salePrice.toLocaleString('vi-VN') + 'đ' : '-'}
                    </td>
                    <td>{product.rating}</td>
                    <td>
                      <Badge bg={totalStock > 10 ? 'success' : totalStock > 0 ? 'warning' : 'danger'}>
                        {totalStock} đôi
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleShowProductModal(product)}
                      >
                        Sửa
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      )}

      {/*danh sach don hang*/}
      {activeTab === 'orders' && (
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
      )}

      {/*danh sach nguoi dung*/}
      {activeTab === 'users' && (
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
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Lịch sử</th>
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
                  <td>
                    <Badge bg={user.status === 'active' ? 'success' : 'danger'}>
                      {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    </Badge>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm"
                      onClick={() => handleShowUserHistory(user)}
                    >
                      Xem lịch sử
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      )}

      {/*danh muc san pham*/}
      {activeTab === 'categories' && (
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Danh mục Sản phẩm</h5>
              <Button variant="primary" size="sm" onClick={() => handleShowCategoryModal()}>
                + Thêm danh mục
              </Button>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên danh mục</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>
                        <Button 
                          variant="warning" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleShowCategoryModal(category)}
                        >
                          Sửa
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Xóa
                        </Button>
                      </td>
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
      )}

      {/* Modal Thêm/Sửa Sản phẩm */}
      <ProductFormModal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        editMode={editProductMode}
        formData={productForm}
        categories={data.categories}
        onInputChange={handleProductInputChange}
        onSizeChange={handleSizeChange}
        onAddSize={addSizeRow}
        onRemoveSize={removeSizeRow}
        onSubmit={handleProductSubmit}
      />

      {/*modal them sua danh muc*/}
      <CategoryFormModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        editMode={editCategoryMode}
        formData={categoryForm}
        onInputChange={(e) => setCategoryForm({ name: e.target.value })}
        onSubmit={handleCategorySubmit}
      />

      {/*modal lich su mua hang*/}
      <UserHistoryModal
        show={showUserHistoryModal}
        onHide={() => setShowUserHistoryModal(false)}
        user={currentUser}
      />
    </div>
  );
}

export default AdminDashboard;

