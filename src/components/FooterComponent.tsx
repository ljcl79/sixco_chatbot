import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const FooterComponent = () => {
  return (
    <footer  className="py-3 mt-auto custom-navbar text-white">
      <Container>
        <Row className="justify-content-between">
          <Col md={4}>
            <h5>Contacto</h5>
            <p>Email: contacto@empresa.com</p>
            <p>Teléfono: (123) 456-7890</p>
          </Col>
          <Col md={4} className="d-flex align-items-center">
          <p className="mb-0">© 2024 Todos los derechos reservados.</p>

          </Col>
          
          <Col md={4}>
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Inicio</a></li>
            
            </ul>
          </Col>
        </Row>
      
      </Container>
    </footer>
  );
};

export default FooterComponent;