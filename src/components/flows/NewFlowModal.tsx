import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useFlows } from '../../context/FlowsContext';
import Swal from "sweetalert2";


function NewFlowModal() {
    const [show, setShow] = useState(false);
    const [newFlow, setNewFlow] = useState({ nombre: "", activo: true });
    const { createFlow } = useFlows();

    const handleClose = () => {
        setShow(false);
        setNewFlow({ nombre: "", activo: true }); // Reiniciar valores
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFlow({ ...newFlow, nombre: e.target.value });
    };

    const handleSave = async () => {
        try {
            await createFlow(newFlow);
            Swal.fire({
                icon: "success",
                title: "Flujo Creado",
                text: "El flujo se creó exitosamente.",
            });

            console.log("Flujo creado:", newFlow);
            handleClose();

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
            });
        }
    };

    return (
        <>
            <Button
                variant="success"
                onClick={handleShow}
                className="d-flex align-items-center gap-2"
            >
                <FontAwesomeIcon icon={faPlus} /> Agregar Flujo
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Flujo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="flowName" className="form-label">Nombre</label>
                    <input
                        type="text"
                        id="flowName"
                        className="form-control"
                        value={newFlow.nombre}
                        onChange={handleChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        disabled={newFlow.nombre.trim() === ""}
                        onClick={handleSave}
                    >
                        Crear Flujo
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewFlowModal;
