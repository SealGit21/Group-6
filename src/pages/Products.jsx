import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expandedFilters, setExpandedFilters] = useState({
    brand: true,
    category: true,
    gender: true,
    color: true,
    size: true,
    price: true,
  });
  const [filters, setFilters] = useState({
    brands: [],
    categories: [],
    genders: [],
    colors: [],
    sizes: [],
    priceRange: null,
  });

  useEffect(() => {
    fetch("http://localhost:9999/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error("Fetch error:", err));

    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const brands = [...new Set(products.map((p) => p.brand))].sort();
  const genders = [...new Set(products.map((p) => p.gender))];
  const colors = [...new Set(products.flatMap((p) => p.colors || []))].sort();
  const sizes = [
    ...new Set(products.flatMap((p) => p.sizes?.map((s) => s.size) || [])),
  ].sort((a, b) => a - b);

  useEffect(() => {
    let filtered = [...products];

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.categoryId)
      );
    }
    if (filters.genders.length > 0) {
      filtered = filtered.filter((p) => filters.genders.includes(p.gender));
    }
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors?.some((c) => filters.colors.includes(c))
      );
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes?.some((s) => filters.sizes.includes(s.size))
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      const filterArray = newFilters[filterType];
      if (filterArray.includes(value)) {
        newFilters[filterType] = filterArray.filter((v) => v !== value);
      } else {
        newFilters[filterType] = [...filterArray, value];
      }
      return newFilters;
    });
  };

  const toggleExpanded = (filterType) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const FilterSection = ({
    title,
    filterType,
    items,
    getLabel = (item) => item,
  }) => {
    const isExpanded = expandedFilters[filterType];

    return (
      <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #e0e0e0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            cursor: "pointer",
          }}
          onClick={() => toggleExpanded(filterType)}
        >
          <h6 style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
            {title}
          </h6>
          <span style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>
            {isExpanded ? "^" : "v"}
          </span>
        </div>
        {isExpanded && (
          <div>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Form.Check
                  type="checkbox"
                  id={`${filterType}-${index}`}
                  checked={filters[filterType].includes(item)}
                  onChange={() => toggleFilter(filterType, item)}
                  style={{ marginRight: "8px" }}
                />
                <label
                  htmlFor={`${filterType}-${index}`}
                  style={{
                    margin: 0,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {getLabel(item)}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={3} className="mb-4">
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              position: "sticky",
              top: "20px",
            }}
          >
            <FilterSection
              title="Thương hiệu"
              filterType="brands"
              items={brands}
            />
            <FilterSection
              title="Danh mục"
              filterType="categories"
              items={categories}
              getLabel={(cat) => cat.name}
            />
            <FilterSection
              title="Giới tính"
              filterType="genders"
              items={genders}
              getLabel={(g) => {
                const labels = {
                  men: "Nam",
                  women: "Nữ",
                  unisex: "Unisex",
                };
                return labels[g] || g;
              }}
            />
            <FilterSection
              title="Màu sắc"
              filterType="colors"
              items={colors}
              getLabel={(c) => {
                const labels = {
                  white: "Trắng",
                  black: "Đen",
                  gray: "Xám",
                  navy: "Xanh navy",
                  brown: "Nâu",
                  tan: "Be",
                  pink: "Hồng",
                  orange: "Cam",
                  volt: "Vàng chanh",
                  blue: "Xanh dương",
                  red: "Đỏ",
                  beige: "Be",
                };
                return labels[c] || c;
              }}
            />
            <FilterSection
              title="Kích cỡ"
              filterType="sizes"
              items={sizes}
              getLabel={(s) => `Size ${s}`}
            />
          </div>
        </Col>

        <Col md={9}>
          <div style={{ marginBottom: "20px" }}>
            <h4>
              Tất cả sản phẩm ({filteredProducts.length})
            </h4>
          </div>
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id} xs={6} md={4} lg={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      flex: "2",
                      backgroundColor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      minHeight: "200px",
                    }}
                  >
                    {product.images && product.images[0] ? (
                      <>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            width: "24px",
                            height: "24px",
                            background: "#e5e5e5",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: "0.7",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#999"
                            strokeWidth="2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            width: "24px",
                            height: "24px",
                            background: "#e5e5e5",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#999"
                            strokeWidth="2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flex: "1",
                      backgroundColor: "#fff",
                    }}
                  >
                    <h6
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: "8px",
                        lineHeight: "1.3",
                      }}
                    >
                      {product.name}
                    </h6>

                    <div style={{ marginBottom: "8px" }}>
                      {product.salePrice && product.salePrice < product.basePrice ? (
                        <>
                          <span
                            style={{
                              color: "#dc3545",
                              fontWeight: "bold",
                              fontSize: "16px",
                              marginRight: "8px",
                            }}
                          >
                            {product.salePrice.toLocaleString()}₫
                          </span>
                          <span
                            style={{
                              color: "#999",
                              textDecoration: "line-through",
                              fontSize: "14px",
                            }}
                          >
                            {product.basePrice.toLocaleString()}₫
                          </span>
                        </>
                      ) : (
                        <span
                          style={{
                            color: "#dc3545",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          {product.basePrice.toLocaleString()}₫
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          color: "#ffa500",
                          fontSize: "14px",
                          marginRight: "4px",
                        }}
                      >
                        ★
                      </span>
                      <span
                        style={{
                          color: "#ffa500",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {product.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>

                    <Button
                      as={Link}
                      to={`/products/${product.id}`}
                      variant="dark"
                      style={{
                        width: "100%",
                        borderRadius: "6px",
                        padding: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor: "#333",
                        border: "none",
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Products;


