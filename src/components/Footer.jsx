import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="bg-dark text-light py-2 mt-auto">
            <Container className="text-center">
                <p className="mb-1">© {new Date().getFullYear()} ShoeShop</p>
                <p className="mb-0">
                    <a href="/about" className="text-decoration-none text-light me-3">About Us</a>
                    <a href="/contact" className="text-decoration-none text-light me-3">Contact</a>
                    <a href="/policy" className="text-decoration-none text-light">Privacy Policy</a>
                </p>
            </Container>
        </footer>
    );
}

export default Footer;
