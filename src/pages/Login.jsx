import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Vui lòng nhập email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email không hợp lệ.";
    if (!password) e.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) e.password = "Mật khẩu ít nhất 6 ký tự.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setStatus(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    // TODO: gọi API thực tế ở đây
    setTimeout(() => {
      setLoading(false);
      if (email === "user@example.com" && password === "password") {
        setStatus({ type: "success", message: "Đăng nhập thành công!" });
      } else {
        setStatus({ type: "danger", message: "Email hoặc mật khẩu không đúng." });
      }
    }, 900);
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Row className="g-0">
              <Col md={5} className="d-none d-md-flex align-items-center justify-content-center bg-dark text-white p-3" style={{backgroundImage:'linear-gradient(135deg,#111827, #1f2937)'}}>
                <div className="text-center px-2">
                  <h4 className="mb-2">Sneaker Shop</h4>
                  {/* <p className="small">Giày thể thao chính hãng — phong cách & thoải mái</p> */}
                  <div style={{width:120, height:120, borderRadius:16, background:"#fff2", display:"inline-block"}} />
                </div>
              </Col>

              <Col md={7} className="p-4">
                <h5 className="mb-3">Đăng nhập</h5>

                {status && (
                  <Alert variant={status.type} onClose={() => setStatus(null)} dismissible>
                    {status.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      value={email}
                      isInvalid={!!errors.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <InputGroup>
                      <FormControl
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={password}
                        isInvalid={!!errors.password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-pressed={showPassword}
                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? "Ẩn" : "Hiện"}
                      </Button>
                      <FormControl.Feedback type="invalid" style={{ display: "none" }} />
                    </InputGroup>
                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check type="checkbox" label="Ghi nhớ tôi" id="rememberMe" />
                    <a href="#forgot" className="small">Quên mật khẩu?</a>
                  </div>

                  <div className="d-grid mb-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </Button>
                  </div>

                  {/* <div className="text-center mb-2">
                    <small className="text-muted">hoặc đăng nhập bằng</small>
                  </div>

                  <div className="d-flex gap-2">
                    <Button variant="outline-dark" className="flex-fill">Google</Button>
                    <Button variant="outline-primary" className="flex-fill">Facebook</Button>
                  </div> */}

                  <div className="text-center mt-3">
                    <small>
                      Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                    </small>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default Login;