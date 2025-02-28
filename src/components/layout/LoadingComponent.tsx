import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingComponent = ({ title }: { title: string }) => {
    return (
        <div className="text-center d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: 'calc(100vh - 300px)' }}>
            <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-primary mb-4"
                style={{ fontSize: '3rem' }}
            />
            <h3 className="text-muted">Cargando {title}...</h3>
            <p className="text-muted">Por favor, espere un momento</p>
        </div>
    );
};

export default LoadingComponent;
