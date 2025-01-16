import { FC } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/img/logo.webp";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="text-center">
        <div className="mb-4 position-relative d-inline-block">
          <img
            src={logo}
            alt="Logo"
            className="rounded-circle"
            style={{
              width: '120px',
              height: '120px',
              opacity: '0.7',
            }}
          />
          <div
            className="position-absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '5rem',
              fontWeight: 'bold',
              color: '#dc3545',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              zIndex: 1,
            }}
          >
            404
          </div>
        </div>

        <h1 className="display-4 mb-4 text-secondary">Página no encontrada</h1>
        <p className="lead text-muted mb-5">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/')}
          className="shadow-sm d-inline-flex align-items-center gap-2"
        >
          <FontAwesomeIcon icon={faHome} />
          Volver al inicio
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;