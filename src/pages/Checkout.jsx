import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import axios from 'axios';
export default function Checkout() {
    const { cartItems, products, userInfo, setUserInfo, calculateTotal } = useContext(CartContext);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod'); // cod / qr

    // useEffect(() => {
    //     if (userInfo) {
    //         setForm({
    //             name: userInfo.name || '',
    //             email: userInfo.email || '',
    //             phone: userInfo.phone || '',
    //             address: userInfo.address || ''
    //         });
    //     }
    // }, [userInfo]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const total = calculateTotal(products || []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        for (let key in form) {
            if (!form[key].trim()) newErrors[key] = `Vui lòng nhập ${key}`;
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setUserInfo(form);
        setErrors({});

        if (paymentMethod === "qr" && !showQR) {
            setShowQR(true);
            return;
        }

        try {
            const now = new Date().toISOString();
            const subtotal = calculateTotal(products);
            const order = {
                userId: userInfo?.id || null,
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    size: item.size,
                    quantity: item.quantity,
                    unitPrice:
                        products.find((p) => p.id === item.productId)?.salePrice ??
                        products.find((p) => p.id === item.productId)?.basePrice,
                })),
                subtotal,
                shipping: 30000,
                total: subtotal + 30000,
                status: "undelivered",
                payment: {
                    method: paymentMethod,
                    status: paymentMethod === "qr" ? "paid" : "unpaid",
                    paidAt: paymentMethod === "qr" ? now : null,
                },
                shippingAddress: form.address,
                createdAt: now,
            };

            // thêm đơn hàng
            await axios.post("http://localhost:9999/orders", order);

            // cập nhật stock
            for (const item of cartItems) {
                const product = products.find((p) => p.id === item.productId);
                if (product) {
                    await axios.patch(`http://localhost:9999/products/${product.id}`, {
                        stock: product.stock - item.quantity,
                    });
                }
            }

            setSuccess(true);
        } catch (err) {
            console.error("Error submitting order:", err);
        }
    };



    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="text-center mb-2">Checkout</h1>

            {!success ? (
                <form onSubmit={handleSubmit}>
                    <h4 className="mb-3">Thông tin khách hàng</h4>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Họ và Tên:</label>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                            />
                            {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="email" className="col-sm-2 col-form-label">Email:</label>
                        <div className="col-sm-6">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                            />
                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="phone" className="col-sm-2 col-form-label">Số điện thoại:</label>
                        <div className="col-sm-3">
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                            />
                            {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="address" className="col-sm-2 col-form-label">Địa chỉ:</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                            />
                            {errors.address && <div className="text-danger small mt-1">{errors.address}</div>}
                        </div>
                    </div>

                    <p className="fw-bold fs-5">Tổng cộng: {total.toLocaleString()}đ</p>
                    <br />
                    <h4>Phương thức thanh toán</h4>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            id="cod"
                        />
                        <label className="form-check-label" htmlFor="cod">Thanh toán COD</label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="payment"
                            value="qr"
                            checked={paymentMethod === 'qr'}
                            onChange={() => setPaymentMethod('qr')}
                            id="qr"
                        />
                        <label className="form-check-label" htmlFor="qr">Thanh toán qua QR</label>
                    </div>

                    {paymentMethod === 'qr' && showQR && (
                        <div className="text-center mt-3">
                            <img src="/QR.png" alt="QR Code thanh toán" style={{ width: '200px' }} />
                            <p className="mt-2 text-muted">Quét mã để thanh toán, sau đó ấn lại nút xác nhận</p>
                        </div>
                    )}

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary mb-3">Xác nhận thanh toán</button>
                    </div>
                </form>
            ) : (
                <div className="text-center mt-4">
                    <h5 className="text-success">Đặt hàng thành công!</h5>
                    <button className="btn btn-secondary mt-2" onClick={() => navigate('/')}>
                        Quay lại trang chủ
                    </button>
                </div>
            )}
        </div>
    );
}
