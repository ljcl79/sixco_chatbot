import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from "../../assets/img/logo.webp";

const FooterComponent = () => {
  return (
    <footer className="py-4 mt-auto custom-navbar text-white" style={{ backgroundColor: '#343a40' }}>
      <Container>
        <Row className="align-items-center text-center text-md-start">
          <Col md={4} className="mb-3 mb-md-0 d-flex align-items-center justify-content-center justify-content-md-start">
            <img
              src={logo}
              width="50"
              height="50"
              className="me-3 rounded-circle"
              alt="Logo"
            />
            <span>© 2024 Todos los derechos reservados.</span>
          </Col>
          <Col md={4} className="mb-3 mb-md-0 text-center">
            <p className="mb-0">Desarrollado por <a href="#" className="text-white fw-bold text-decoration-none">Sixco</a></p>
          </Col>
          <Col md={4} className="text-center text-md-end">
            <a href="#" className="text-white me-3">Política de Privacidad</a>
            <a href="#" className="text-white">Términos y Condiciones</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
