import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Carousel } from "react-bootstrap";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`http://localhost:9999/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
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

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  if (loading) {
    return (
      <Container className="py-5">
        <div>Đang tải...</div>
      </Container>
    );
  }

  if (notFound || !product) {
    return (
      <Container className="py-5">
        <h5>Không tìm thấy sản phẩm.</h5>
        <Button as={Link} to="/products" variant="dark" className="mt-3">
          Quay lại sản phẩm
        </Button>
      </Container>
    );
  }

  const images = product.images && product.images.length ? product.images : ["/logo/thiet-ke-logo-shop-giay-19_1584095087.jpg"]; 
  const sizes = product.sizes || [];
  const inStock = (size) => (product.sizes || []).find((s) => s.size === size)?.stock > 0;

  return (
    <Container className="py-4">
      <Row>
        {/* Left: Gallery thumbnails */}
        <Col md={1} className="d-none d-md-block">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                style={{
                  border: idx === activeImgIdx ? "2px solid #0d6efd" : "1px solid #e5e5e5",
                  padding: 0,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "transparent",
                  cursor: "pointer",
                }}
                aria-label={`Ảnh ${idx + 1}`}
              >
                <img src={src} alt={`thumb-${idx}`} style={{ width: "100%", display: "block" }} />
              </button>
            ))}
          </div>
        </Col>

        {/* Center: Main Image (Carousel) */}
        <Col md={7} className="mb-4">
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Carousel
              activeIndex={activeImgIdx}
              onSelect={(selected) => setActiveImgIdx(selected)}
              indicators={images.length > 1}
              interval={3000}
              fade
              controls={images.length > 1}
              prevIcon={
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="#fff">
                    <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </span>
              }
              nextIcon={
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="#fff">
                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </span>
              }
              style={{ height: "100%" }}
            >
              {images.map((src, idx) => (
                <Carousel.Item key={idx} style={{ height: "100%" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fff",
                    }}
                  >
                    <img
                      src={src}
                      alt={`${product.name}-${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </Col>

        {/* Right: Info */}
        <Col md={4}>
          <div className="mb-2" style={{ color: "#6c757d", fontSize: 14 }}>
            <Link to="/products">Sản phẩm</Link> / {product.brand}
          </div>
          <h4 className="mb-2" style={{ lineHeight: 1.3 }}>{product.name}</h4>

          <div className="mb-2" style={{ color: "#ffc107" }}>
            {"★".repeat(Math.round(product.rating || 0))}
            <span className="ms-2" style={{ color: "#6c757d" }}>{(product.rating || 0).toFixed(1)} / 5</span>
          </div>

          {priceBlock}

          <div className="mt-3">
            <div className="mb-2" style={{ fontWeight: 600 }}>Chọn size</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {sizes.map(({ size, stock }) => {
                const active = selectedSize === size;
                const disabled = stock <= 0;
                return (
                  <button
                    key={size}
                    disabled={disabled}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: 48,
                      height: 40,
                      borderRadius: 8,
                      border: active ? "2px solid #0d6efd" : "1px solid #dee2e6",
                      background: disabled ? "#f8f9fa" : "#fff",
                      color: disabled ? "#adb5bd" : "#212529",
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                    aria-pressed={active}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-2" style={{ fontWeight: 600 }}>Số lượng</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: 40, height: 40, border: "1px solid #dee2e6", background: "#fff" }}
                aria-label="Giảm"
              >
                −
              </button>
              <input
                value={qty}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setQty(Number.isFinite(v) && v > 0 ? v : 1);
                }}
                style={{
                  width: 60,
                  height: 40,
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  borderLeft: "none",
                  borderRight: "none",
                  textAlign: "center",
                }}
              />
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: 40, height: 40, border: "1px solid #dee2e6", background: "#fff" }}
                aria-label="Tăng"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <Button
              variant="primary"
              style={{ flex: 1, height: 48, fontWeight: 600 }}
              onClick={() => alert("Đã thêm vào giỏ (demo)")}
              disabled={!selectedSize}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="danger"
              style={{ flex: 1, height: 48, fontWeight: 600 }}
              onClick={() => alert("Mua ngay (demo)")}
              disabled={!selectedSize}
            >
              Mua ngay
            </Button>
          </div>

          <div className="mt-3" style={{ color: "#198754", fontSize: 14 }}>
            <Badge bg="success">Còn hàng</Badge>
            <span className="ms-2">Giao hàng nhanh toàn quốc</span>
          </div>

          <div className="mt-4" style={{ color: "#6c757d", fontSize: 14 }}>
            Mã sản phẩm: #{product.id}
          </div>
        </Col>
      </Row>

      {/* Description */}
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
