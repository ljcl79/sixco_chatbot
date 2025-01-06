import { useFlows } from '../context/FlowsContext';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import NewFlowModal from '../components/flows/NewFlowModal';
import { useNavigate } from "react-router-dom";
import { faArrowUpRightFromSquare, faTrash, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons'

const FlowsViews = () => {
    const { flows, isLoading, error } = useFlows();
    const navigate = useNavigate();


    if (isLoading) return <div className="text-center d-flex justify-content-center align-items-center" ><h1>Cargando...</h1></div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1 className="text-center mt-4 mb-5">FLUJOS DE TRABAJO</h1>
            <div className="d-flex justify-content-end mb-4 container ">
                <NewFlowModal />
            </div>
            <div className="row layout">
                {flows.map(flow => (
                    <div className="col-md-4 mb-5" key={flow.id_flujo}>
                        <div className="card p-5 shadow p-3 mb-2 bg-body-tertiary rounded" style={{ minHeight: '20rem' }} >
                            <div className="d-flex justify-content-end "><FontAwesomeIcon className="text-primary click-style" onClick={() => navigate(`/flujo/${flow.id_flujo}`)} icon={faArrowUpRightFromSquare} /></div>
                            <div className="card-body">
                                <h4 className="card-title text-center mb-5">{flow.nombre.toUpperCase()}</h4>
                                <div className="d-flex justify-content-between aling-items-center">
                                    <div className="mt-4">
                                        <span className=" click-style me-4 mt-5" ><FontAwesomeIcon className="text-warning" icon={faPenToSquare} /> Editar</span>
                                        <span className=" click-style me-3 mt-5" ><FontAwesomeIcon className="text-danger" icon={faTrash} /> Eliminar</span>
                                    </div>
                                    <div>
                                        <h4
                                            className={`card-subtitle badge mt-4 ${flow.activo ? "text-bg-success" : "text-bg-danger"
                                                }`}
                                        >
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

export default FlowsViews
