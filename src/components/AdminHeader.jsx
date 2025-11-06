import { Navbar, Container, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';

function AdminHeader() {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        const onUserChanged = (e) => {
            setUser(e.detail || JSON.parse(localStorage.getItem('user')) || null);
        };
        window.addEventListener('userChanged', onUserChanged);
        return () => window.removeEventListener('userChanged', onUserChanged);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ height: '80px' }}>
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <Image
                        src="/logo/thiet-ke-logo-shop-giay-19_1584095087.jpg"
                        alt="Logo"
                        width="40"
                        height="40"
                        roundedCircle
                        className="me-2"
                    />
                    <span>ShoeShop</span>
                </Navbar.Brand>

                <div className="text-white">
                    <span style={{ fontSize: '1.1rem' }}>ShoeShop Admin Panel</span>
                </div>

                <div className="d-flex align-items-center">
                    {user && (
                        <span className="text-white me-3">
                            {user.name || user.email}
                        </span>
                    )}
                    <Button 
                        variant="outline-light" 
                        size="sm" 
                        className="me-2"
                        onClick={() => navigate('/')}
                    >
                        Về trang chủ
                    </Button>
                    <Button 
                        variant="light" 
                        size="sm"
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </Container>
        </Navbar>
    );
}

export default AdminHeader;

