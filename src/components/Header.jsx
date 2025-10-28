import { Navbar, Nav, Container, FormControl, Form, Button, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
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

                <Form className="d-flex">
                    <FormControl className="me-2" type="text" placeholder="Search" />
                    <Button variant="outline-light">Search</Button>
                </Form>
                <NavLink to="/cart" className=" ms-4" style={({ isActive }) => ({
                    color: isActive ? 'red' : 'white', textDecoration: 'none', fontSize: '1.4rem'
                })}><Image
                        src="/logo/cart.png"
                        alt="Cart"
                        width="35"
                        height="35"
                        className="me-1"
                    />

                </NavLink>s
            </Container>
        </Navbar>
    );
}

export default Header;
