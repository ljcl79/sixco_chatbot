import { useFlows } from '../context/FlowsContext';
import NewFlowModal from '../components/flows/NewFlowModal';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowUpRightFromSquare,
    faTrash,
    faPenToSquare,
    faSpinner,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Card } from 'react-bootstrap';

const LoadingState = () => (
    <div className="text-center d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: 'calc(100vh - 300px)' }}>
        <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-primary mb-4"
            style={{ fontSize: '3rem' }}
        />
        <h3 className="text-muted">Cargando flujos de trabajo...</h3>
        <p className="text-muted">Por favor, espere un momento</p>
    </div>
);

const ErrorState = ({ error }: { error: Error }) => (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <Card className="border-danger shadow-sm mt-5">
                    <Card.Body className="text-center p-5">
                        <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="text-danger mb-4"
                            style={{ fontSize: '3rem' }}
                        />
                        <h3 className="text-danger mb-3">¡Ups! Algo salió mal</h3>
                        <p className="text-muted mb-4">
                            {error.message || 'Ha ocurrido un error al cargar los flujos de trabajo'}
                        </p>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => window.location.reload()}
                        >
                            Intentar nuevamente
                        </button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </div>
);

const FlowsViews = () => {
    const { flows, isLoading, error } = useFlows();
    const navigate = useNavigate();

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="container">
            <h1 className="text-center mt-4 mb-5">FLUJOS DE TRABAJO</h1>
            <div className="d-flex justify-content-end mb-4 container">
                <NewFlowModal />
            </div>
            <div className="row layout">
                {flows.map(flow => (
                    <div className="col-md-4 mb-5" key={flow.id_flujo}>
                        <div className="card p-5 shadow p-3 mb-2 bg-body-tertiary rounded"
                            style={{ minHeight: '20rem' }}>
                            <div className="d-flex justify-content-end">
                                <FontAwesomeIcon
                                    className="text-primary click-style"
                                    onClick={() => navigate(`/flujo/${flow.id_flujo}`)}
                                    icon={faArrowUpRightFromSquare}
                                />
                            </div>
                            <div className="card-body">
                                <h4 className="card-title text-center mb-5">
                                    {flow.nombre.toUpperCase()}
                                </h4>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="mt-4">
                                        <span className="click-style me-4 mt-5">
                                            <FontAwesomeIcon className="text-warning" icon={faPenToSquare} />
                                            Editar
                                        </span>
                                        <span className="click-style me-3 mt-5">
                                            <FontAwesomeIcon className="text-danger" icon={faTrash} />
                                            Eliminar
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className={`card-subtitle badge mt-4 ${flow.activo ? "text-bg-success" : "text-bg-danger"
                                            }`}>
                                            {flow.activo ? "Activo" : "Inactivo"}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FlowsViews;