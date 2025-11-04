import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [scrollPositionNew, setScrollPositionNew] = useState(0);
  const [scrollPositionHot, setScrollPositionHot] = useState(0);
  const [scrollPositionTop, setScrollPositionTop] = useState(0);

  useEffect(() => {
    fetch("http://localhost:9999/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const hotDeals = products
    .filter(p => p.salePrice && p.salePrice < p.basePrice)
    .sort((a, b) => (a.salePrice / a.basePrice) - (b.salePrice / b.basePrice))
    .slice(0, 5);


  const topRated = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const renderList = (list, sectionType) => (
    <Row className="g-3">
      {list.map((p) => (
        <Col key={p.id} xs={6} md={4} lg={3}>
          <Card 
            className="h-100 shadow-sm" 
            style={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <Card.Img
                variant="top"
                src={p.images && p.images[0] ? p.images[0] : "/logo/thiet-ke-logo-shop-giay-19_1584095087.jpg"}
                style={{ 
                  height: 200, 
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              />
              {sectionType === "hotDeals" && p.salePrice && p.salePrice < p.basePrice && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  SALE
                </div>
              )}
            </div>
            <Card.Body style={{ display: "flex", flexDirection: "column" }}>
              <Card.Title className="fs-6" style={{ minHeight: "48px" }}>
                {p.name}
              </Card.Title>
              <Card.Text className="mb-2">
                {p.salePrice != null && p.salePrice < p.basePrice ? (
                  <>
                    <span className="text-danger fw-bold fs-5">
                      {p.salePrice.toLocaleString()}₫
                    </span>{" "}
                    <span className="text-muted text-decoration-line-through small ms-2">
                      {p.basePrice.toLocaleString()}₫
                    </span>
                  </>
                ) : (
                  <span className="fw-bold fs-5">{p.basePrice.toLocaleString()}₫</span>
                )}
              </Card.Text>
              <Card.Text className="text-warning small mb-3">
                <span style={{ fontSize: "16px" }}>⭐</span> {p.rating.toFixed(1)}/5
              </Card.Text>
              <Button
                as={Link}
                to={`/products/${p.id}`}
                variant="dark"
                size="sm"
                className="mt-auto"
                style={{
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#000";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#212529";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Xem chi tiết
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderScrollableList = (list, sectionType, scrollPosition, setScrollPosition, buttonColor = "#667eea") => {
    const itemWidth = 285; 
    const gap = 15; 
    const totalItemWidth = itemWidth + gap;
    const visibleItems = 4;

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const darkenColor = (hex, percent) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return hex;
      const r = Math.max(0, Math.floor(rgb.r * (1 - percent / 100)));
      const g = Math.max(0, Math.floor(rgb.g * (1 - percent / 100)));
      const b = Math.max(0, Math.floor(rgb.b * (1 - percent / 100)));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const hoverColor = darkenColor(buttonColor, 15);

    const scrollLeft = () => {
      const newPosition = Math.max(0, scrollPosition - totalItemWidth);
      setScrollPosition(newPosition);
    };

    const scrollRight = () => {
      const maxScroll = Math.max(0, (list.length - visibleItems) * totalItemWidth);
      const newPosition = Math.min(maxScroll, scrollPosition + totalItemWidth);
      setScrollPosition(newPosition);
    };
    
    const canScrollRight = () => {
      if (list.length <= visibleItems) return false;
      const maxScroll = Math.max(0, (list.length - visibleItems) * totalItemWidth);
      return scrollPosition < maxScroll - 1; 
    };

    return (
      <div style={{ position: "relative", padding: "0 50px" }}>
        <div
          style={{
            display: "flex",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            position: "relative",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: `${gap}px`,
              transform: `translateX(-${scrollPosition}px)`,
              transition: "transform 0.5s ease",
              paddingRight: "20px", 
            }}
          >
            {list.map((p, index) => (
              <div
                key={p.id}
                style={{
                  minWidth: `${itemWidth}px`,
                  width: `${itemWidth}px`,
                  flexShrink: 0,
                }}
              >
                <Card 
                  className="h-100 shadow-sm" 
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={p.images && p.images[0] ? p.images[0] : "/logo/thiet-ke-logo-shop-giay-19_1584095087.jpg"}
                      style={{ 
                        height: 200, 
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                    {sectionType === "hotDeals" && p.salePrice && p.salePrice < p.basePrice && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        SALE
                      </div>
                    )}
                  </div>
                  <Card.Body style={{ display: "flex", flexDirection: "column" }}>
                    <Card.Title className="fs-6" style={{ minHeight: "48px" }}>
                      {p.name}
                    </Card.Title>
                    <Card.Text className="mb-2">
                      {p.salePrice != null && p.salePrice < p.basePrice ? (
                        <>
                          <span className="text-danger fw-bold fs-5">
                            {p.salePrice.toLocaleString()}₫
                          </span>{" "}
                          <span className="text-muted text-decoration-line-through small ms-2">
                            {p.basePrice.toLocaleString()}₫
                          </span>
                        </>
                      ) : (
                        <span className="fw-bold fs-5">{p.basePrice.toLocaleString()}₫</span>
                      )}
                    </Card.Text>
                    <Card.Text className="text-warning small mb-3">
                      <span style={{ fontSize: "16px" }}>⭐</span> {p.rating.toFixed(1)}/5
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/products/${p.id}`}
                      variant="dark"
                      size="sm"
                      className="mt-auto"
                      style={{
                        borderRadius: "6px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#000";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#212529";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
        {list.length > visibleItems && (
          <>
            {scrollPosition > 0 && (
              <button
                onClick={scrollLeft}
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
              </button>
            )}
            {canScrollRight() && (
              <button
                onClick={scrollRight}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  const featuredProducts = products.slice(0, 5);

  return (
    <Container className="py-4">
      <div className="mb-5">
        <Carousel fade indicators={false} controls={true} interval={4000}>
          {featuredProducts.map((product, index) => (
            <Carousel.Item key={product.id || index}>
              <div
                style={{
                  height: "400px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: product.images && product.images[0] 
                      ? `url(${product.images[0]})` 
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.3,
                    filter: "blur(2px)",
                  }}
                />
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      maxHeight: "300px",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.6), transparent)",
                    padding: "30px 20px 20px",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                      marginBottom: "10px",
                    }}
                  >
                    {product.name}
                  </h2>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                      margin: 0,
                    }}
                  >
                    {product.salePrice && product.salePrice < product.basePrice ? (
                      <>
                        <span style={{ textDecoration: "line-through", opacity: 0.8, marginRight: "10px" }}>
                          {product.basePrice.toLocaleString()}₫
                        </span>
                        <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                          {product.salePrice.toLocaleString()}₫
                        </span>
                      </>
                    ) : (
                      <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                        {product.basePrice.toLocaleString()}₫
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div
        className="mb-5"
        style={{
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          padding: "30px 20px",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            paddingBottom: "15px",
            borderBottom: "3px solid #667eea",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "40px",
              backgroundColor: "#667eea",
              marginRight: "15px",
              borderRadius: "2px",
            }}
          />
          <h3
            style={{
              margin: 0,
              fontWeight: "bold",
              color: "#333",
              fontSize: "1.8rem",
            }}
          >
            ✨ Sản phẩm mới
          </h3>
        </div>
        {renderScrollableList(newProducts, "newProducts", scrollPositionNew, setScrollPositionNew, "#667eea")}
      </div>

      <div
        className="mb-5"
        style={{
          backgroundColor: "rgba(220, 53, 69, 0.1)",
          padding: "30px 20px",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            paddingBottom: "15px",
            borderBottom: "3px solid #dc3545",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "40px",
              backgroundColor: "#dc3545",
              marginRight: "15px",
              borderRadius: "2px",
            }}
          />
          <h3
            style={{
              margin: 0,
              fontWeight: "bold",
              color: "#333",
              fontSize: "1.8rem",
            }}
          >
            🔥 Giảm giá hấp dẫn
          </h3>
        </div>
        {renderScrollableList(hotDeals, "hotDeals", scrollPositionHot, setScrollPositionHot, "#dc3545")}
      </div>

      <div
        className="mb-5"
        style={{
          backgroundColor: "rgba(255, 193, 7, 0.1)",
          padding: "30px 20px",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            paddingBottom: "15px",
            borderBottom: "3px solid #ffc107",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "40px",
              backgroundColor: "#ffc107",
              marginRight: "15px",
              borderRadius: "2px",
            }}
          />
          <h3
            style={{
              margin: 0,
              fontWeight: "bold",
              color: "#333",
              fontSize: "1.8rem",
            }}
          >
            ⭐ Được đánh giá cao
          </h3>
        </div>
        {renderScrollableList(topRated, "topRated", scrollPositionTop, setScrollPositionTop, "#ffc107")}
      </div>
    </Container>
  );
}

export default Home;
