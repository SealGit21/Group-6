import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Carousel, Alert } from "react-bootstrap";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userId, setUserId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserId(user.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Lấy sản phẩm theo id
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`http://localhost:9999/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        setProduct(data);
        setActiveImgIdx(0);
        setSelectedSize(null);
        setQty(1);
        setNotFound(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setNotFound(true);
      })
      .finally(() => isMounted && setLoading(false));

    return () => { isMounted = false; };
  }, [id]);

  // Thêm vào giỏ hàng
  const addToCart = async () => {
  if (!userId) {
    setAlertMessage("Vui lòng đăng nhập để thêm vào giỏ hàng");
    setShowAlert(true);
    return;
  }

  if (!selectedSize) {
    setAlertMessage("Vui lòng chọn size");
    setShowAlert(true);
    return;
  }

  const selectedSizeStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0;
  if (selectedSizeStock < qty) {
    setAlertMessage(`Chỉ còn ${selectedSizeStock} sản phẩm cho size ${selectedSize}`);
    setShowAlert(true);
    return;
  }

  setAddingToCart(true);

  try {
    // Lấy giỏ hàng hiện tại của user
    const res = await fetch(`http://localhost:9999/carts?userId=${userId}`);
    const userCartItems = await res.json();

    const existingItem = userCartItems.find(
      item => item.productId === product.id && item.size === selectedSize
    );

    if (existingItem) {
      // Cập nhật số lượng
      await fetch(`http://localhost:9999/carts/${existingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: existingItem.quantity + qty })
      });
    } else {
      // Thêm sản phẩm mới
      await fetch('http://localhost:9999/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          productId: product.id,
          size: selectedSize,
          quantity: qty
        })
      });
    }

    setAlertMessage("Đã thêm vào giỏ hàng thành công!");
    setShowAlert(true);
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    setAlertMessage("Có lỗi xảy ra khi thêm vào giỏ hàng");
    setShowAlert(true);
  } finally {
    setAddingToCart(false);
  }
};


  // Mua ngay
  const handleBuyNow = async () => {
    if (!userId) {
      setAlertMessage("Vui lòng đăng nhập để mua hàng");
      setShowAlert(true);
      return;
    }
    if (!selectedSize) {
      setAlertMessage("Vui lòng chọn size");
      setShowAlert(true);
      return;
    }
    await addToCart();
    setTimeout(() => navigate("/checkout"), 500);
  };

  const priceBlock = useMemo(() => {
    if (!product) return null;
    const hasSale = product.salePrice != null && product.salePrice < product.basePrice;
    return (
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <div style={{ color: "#dc3545", fontWeight: 800, fontSize: 28 }}>
          {(hasSale ? product.salePrice : product.basePrice).toLocaleString()}đ
        </div>
        {hasSale && (
          <div style={{ color: "#6c757d", textDecoration: "line-through" }}>
            {product.basePrice.toLocaleString()}đ
          </div>
        )}
      </div>
    );
  }, [product]);

  if (loading) return <Container className="py-5">Đang tải...</Container>;
  if (notFound || !product) return (
    <Container className="py-5">
      <h5>Không tìm thấy sản phẩm.</h5>
      <Button as={Link} to="/products" variant="dark" className="mt-3">Quay lại sản phẩm</Button>
    </Container>
  );

  const images = product.images && product.images.length ? product.images : ["/logo/thiet-ke-logo-shop-giay-19_1584095087.jpg"];
  const sizes = product.sizes || [];

  return (
    <Container className="py-4">
      {showAlert && <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}

      <Row>
        <Col md={1} className="d-none d-md-block">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {images.map((src, idx) => (
              <button key={idx} onClick={() => setActiveImgIdx(idx)}
                style={{
                  border: idx === activeImgIdx ? "2px solid #0d6efd" : "1px solid #e5e5e5",
                  padding: 0, borderRadius: 8, overflow: "hidden", background: "transparent", cursor: "pointer"
                }}>
                <img src={src} alt={`thumb-${idx}`} style={{ width: "100%", display: "block" }} />
              </button>
            ))}
          </div>
        </Col>

        <Col md={7} className="mb-4">
          <div style={{ width: "100%", aspectRatio: "4/3", background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
            <Carousel activeIndex={activeImgIdx} onSelect={setActiveImgIdx} indicators={images.length > 1} interval={3000} fade controls={images.length > 1}>
              {images.map((src, idx) => (
                <Carousel.Item key={idx} style={{ height: "100%" }}>
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
                    <img src={src} alt={`${product.name}-${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </Col>

        <Col md={4}>
          <div className="mb-2" style={{ color: "#6c757d", fontSize: 14 }}>
            <Link to="/products">Sản phẩm</Link> / {product.brand}
          </div>
          <h4 className="mb-2">{product.name}</h4>

          <div className="mb-2" style={{ color: "#ffc107" }}>
            {"★".repeat(Math.round(product.rating || 0))}
            <span className="ms-2" style={{ color: "#6c757d" }}>{(product.rating || 0).toFixed(1)} / 5</span>
          </div>

          {priceBlock}

          <div className="mt-3">
            <div className="mb-2" style={{ fontWeight: 600 }}>Chọn size</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {sizes.map(({ size, stock }) => (
                <button key={size} disabled={stock <= 0} onClick={() => setSelectedSize(size)}
                  style={{
                    minWidth: 48, height: 40, borderRadius: 8,
                    border: selectedSize === size ? "2px solid #0d6efd" : "1px solid #dee2e6",
                    background: stock <= 0 ? "#f8f9fa" : "#fff",
                    color: stock <= 0 ? "#adb5bd" : "#212529",
                    cursor: stock <= 0 ? "not-allowed" : "pointer"
                  }}>{size}</button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-2" style={{ fontWeight: 600 }}>Số lượng</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: "1px solid #dee2e6", background: "#fff" }}>−</button>
              <input value={qty} onChange={e => { const v = parseInt(e.target.value, 10); setQty(Number.isFinite(v) && v > 0 ? v : 1); }} style={{ width: 60, height: 40, borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none", textAlign: "center" }} />
              <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, border: "1px solid #dee2e6", background: "#fff" }}>+</button>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <Button variant="primary" style={{ flex: 1, height: 48, fontWeight: 600 }} onClick={addToCart} disabled={!selectedSize || addingToCart}>
              {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
            </Button>
            <Button variant="danger" style={{ flex: 1, height: 48, fontWeight: 600 }} onClick={handleBuyNow} disabled={!selectedSize || addingToCart}>
              Mua ngay
            </Button>
          </div>

          <div className="mt-3" style={{ color: "#198754", fontSize: 14 }}>
            <Badge bg="success">Còn hàng</Badge>
            <span className="ms-2">Giao hàng nhanh toàn quốc</span>
          </div>

          <div className="mt-4" style={{ color: "#6c757d", fontSize: 14 }}>Mã sản phẩm: #{product.id}</div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={8}>
          <h5>Mô tả sản phẩm</h5>
          <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
        </Col>
        <Col md={4}>
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
            <h6 className="mb-3">Thông tin khác</h6>
            <div className="mb-2"><strong>Thương hiệu:</strong> {product.brand}</div>
            <div className="mb-2"><strong>Danh mục:</strong> {product.categoryId}</div>
            <div className="mb-2"><strong>Giới tính:</strong> {product.gender}</div>
            <div className="mb-2"><strong>Màu sắc:</strong> {(product.colors || []).join(", ")}</div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Detail;
