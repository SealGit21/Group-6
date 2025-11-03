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

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Vui lòng nhập họ và tên.";
    if (!email) e.email = "Vui lòng nhập email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email không hợp lệ.";
    if (!password) e.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) e.password = "Mật khẩu ít nhất 6 ký tự.";
    if (!confirm) e.confirm = "Vui lòng xác nhận mật khẩu.";
    else if (password !== confirm) e.confirm = "Mật khẩu xác nhận không khớp.";
    if (!accept) e.accept = "Bạn cần đồng ý điều khoản.";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setStatus(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    // simulate API
    setTimeout(() => {
      setLoading(false);
      setStatus({ type: "success", message: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt." });
      // optional: reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      setAccept(false);
    }, 1000);
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
                  {/* <p className="small">Thêm phong cách cho từng bước chân</p> */}
                  <div style={{width:100, height:100, borderRadius:12, background:"#fff2", display:"inline-block"}} />
                </div>
              </Col>

              <Col md={7} className="p-4">
                <h5 className="mb-3">Tạo tài khoản</h5>

                {status && (
                  <Alert variant={status.type} onClose={() => setStatus(null)} dismissible>
                    {status.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="formFullName">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={fullName}
                      isInvalid={!!errors.fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      value={email}
                      isInvalid={!!errors.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
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
                    </InputGroup>
                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formConfirm">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu"
                      value={confirm}
                      isInvalid={!!errors.confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirm}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formAccept">
                    <Form.Check
                      type="checkbox"
                      label="Tôi đồng ý với Điều khoản & Chính sách"
                      checked={accept}
                      isInvalid={!!errors.accept}
                      onChange={(e) => setAccept(e.target.checked)}
                    />
                    {errors.accept && <div className="text-danger small mt-1">{errors.accept}</div>}
                  </Form.Group>

                  <div className="d-grid mb-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Đăng ký"}
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <small>
                      Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </small>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>

          <div className="text-center mt-3 small text-muted">
            © {new Date().getFullYear()} Sneaker Shop
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;