import { Navbar, Nav, Container, FormControl, Form, Button, Image } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useEffect } from 'react';

function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    //xử lý user đăng nhập/chưa đăng nhập
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    // Listen to custom event dispatched from Login so header updates immediately
    useEffect(() => {
        const onUserChanged = (e) => {
            setUser(e.detail || JSON.parse(localStorage.getItem('user')) || null);
        };
        window.addEventListener('userChanged', onUserChanged);
        return () => window.removeEventListener('userChanged', onUserChanged);
    }, []);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ height: '70px' }}>
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
                    <Image
                        src="/logo/thiet-ke-logo-shop-giay-19_1584095087.jpg"
                        alt="Logo"
                        width="40"
                        height="40"
                        roundedCircle
                        className="me-2"
                    />
                    ShoeShop
                </Navbar.Brand>
                <Nav className="mx-auto" >
                    <NavLink to="/" className="nav-link px-3" style={({ isActive }) => ({
                        color: isActive ? 'red' : 'white', textDecoration: 'none', fontSize: '1.4rem',
                    })}>Home</NavLink>

                    <NavLink to="/products" className="nav-link px-3" style={({ isActive }) => ({
                        color: isActive ? 'red' : 'white', textDecoration: 'none', fontSize: '1.4rem'
                    })}>Products</NavLink>
                </Nav>

                <Form className="d-flex me-4">
                    <FormControl className="me-2" type="text" placeholder="Search" />

                </Form>

                {user ? (
                    <div className="d-flex align-items-center ms-3">
                        {/* Profile button */}
                        <Button variant="outline-light" className="me-2" onClick={() => navigate('/profile')}>
                            {user.name}
                        </Button>

                        <Button variant="light" onClick={handleLogout}>Đăng xuất</Button>
                    </div>
                ) : (
                    <div className="ms-3">
                        <Button
                            variant="outline-light"
                            className="me-2"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </Button>
                        <Button variant="light" onClick={() => navigate('/register')}>
                            Đăng ký
                        </Button>
                    </div>
                )}
                <NavLink to="/cart"
                    onClick={(e) => {
                        if (!user) {
                            e.preventDefault();
                            alert('Vui lòng đăng nhập trước khi xem giỏ hàng.');
                            navigate('/login');
                        } else {
                            navigate('/cart');
                        }
                    }}

                    className=" ms-4"
                    style={({ isActive }) => ({ color: isActive ? 'red' : 'white', textDecoration: 'none', fontSize: '1.4rem' })}>

                    <Image
                        src="/logo/cart.png"
                        alt="Cart"
                        width="35"
                        height="35"
                        className="me-1"
                    />

                </NavLink>


            </Container>
        </Navbar>
    );
}

export default Header;
