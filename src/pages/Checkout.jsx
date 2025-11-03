import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';

export default function Checkout() {
    const { cartItems, products, userInfo, setUserInfo, calculateTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod'); // cod / qr

    useEffect(() => {
        setForm({
            name: userInfo.name || '',
            email: userInfo.email || '',
            phone: userInfo.phone || '',
            address: userInfo.address || ''
        });
    }, [userInfo]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const total = calculateTotal(products || []);

    const handleSubmit = (e) => {
        e.preventDefault();
        for (let key in form) {
            if (!form[key]) {
                alert(`Vui lòng nhập ${key}`);
                return;
            }
        }
        setUserInfo(form);
        if (paymentMethod === 'qr') {
            alert('Hiển thị QR thanh toán (giả lập)');
        } else {
            alert('Đặt hàng thành công!');
            navigate('/');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="text-center mb-2">Checkout</h1>

            <form onSubmit={handleSubmit}>
                <h4 className='mb-3'>Thông tin khách hàng</h4>
                <div className="row mb-3 align-items-center">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Họ và Tên:</label>
                    <div className="col-sm-6">
                        <input type="text" className="form-control" id="name" placeholder="Nhập họ và tên" />
                    </div>
                </div>

                <div className="row mb-3 align-items-center">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email:</label>
                    <div className="col-sm-6">
                        <input type="email" className="form-control" id="email" placeholder="Nhập email" />
                    </div>
                </div>

                <div className="row mb-3 align-items-center">
                    <label htmlFor="phone" className="col-sm-2 col-form-label">Số điện thoại:</label>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" id="phone" placeholder="Nhập số điện thoại" />
                    </div>
                </div>

                <div className="row mb-3 align-items-center">
                    <label htmlFor="address" className="col-sm-2 col-form-label">Địa chỉ:</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" id="address" placeholder="Nhập địa chỉ" />
                    </div>
                </div>
                <p className="fw-bold fs-5">Tổng cộng: {total.toLocaleString()}đ</p>
<br></br>
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
                    <label className="form-check-label" htmlFor="qr">
                        Thanh toán qua QR
                    </label>
                </div>


                <div className='text-center'><button type="submit" className="btn btn-primary">Xác nhận thanh toán</button></div>
            </form>
        </div>
    );
}
