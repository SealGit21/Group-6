import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Danh sách highlight
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

  // --- Hàm render danh sách ---
  const renderList = (list) => (
    <Row className="g-3">
      {list.map((p) => (
        <Col key={p.id} xs={6} md={4} lg={3}>
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src={p.images[0]}
              style={{ height: 200, objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title className="fs-6">{p.name}</Card.Title>
              <Card.Text>
                {p.salePrice != null && p.salePrice < p.basePrice ? (
                  <>
                    <span className="text-danger fw-bold">Giá:
                     { } {p.salePrice.toLocaleString()}đ
                    </span>{" "}
                    <span className="text-muted text-decoration-line-through small">
                      Giá: {p.basePrice.toLocaleString()}đ
                    </span>
                  </>
                ) : (
                  <span>Giá: {" "}{p.basePrice.toLocaleString()}đ</span>
                )}

              </Card.Text>
              <Card.Text className="text-warning small mb-2">
               Đánh giá: {" "}{p.rating.toFixed(1)}/5⭐
              </Card.Text>
              <Button
                as={Link}
                to={`/products/${p.id}`}
                variant="dark"
                size="sm"
              >
                Xem chi tiết
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Container className="py-4">
      <h4 className="mb-3">Sản phẩm mới</h4>
      {renderList(newProducts)}

      <h4 className="mt-5 mb-3">Giảm giá hấp dẫn</h4>
      {renderList(hotDeals)}

      <h4 className="mt-5 mb-3">Được đánh giá cao</h4>
      {renderList(topRated)}
    </Container>
  );
}

export default Home;
