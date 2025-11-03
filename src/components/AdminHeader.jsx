import { Navbar, Container, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminHeader() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ height: '80px' }}>
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand className="d-flex align-items-center">
                    <Image
                        src="/logo/thiet-ke-logo-shop-giay-19_1584095087.jpg"
                        alt="Logo"
                        width="40"
                        height="40"
                        roundedCircle
                        className="me-2"
                    />
                    <span>👑 Admin Dashboard</span>
                </Navbar.Brand>

                <div className="text-white">
                    <span style={{ fontSize: '1.1rem' }}>ShoeShop Admin Panel</span>
                </div>
            </Container>
        </Navbar>
    );
}

export default AdminHeader;

