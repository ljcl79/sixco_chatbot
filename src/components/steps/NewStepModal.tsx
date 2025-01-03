import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import axios from 'axios';

const NewStepModal = ({ id, onStepAdded }: { id: number; onStepAdded: () => void }) => {
    const [show, setShow] = useState(false);
    const [newStep, setNewStep] = useState({
        tipo: "entrada_numero",
        mensaje: "",
        tipo_entrada: "numero",
        es_final: false,
    });

    const handleClose = () => {
        setShow(false);
        setNewStep({
            tipo: "entrada_numero",
            mensaje: "",
            tipo_entrada: "numero",
            es_final: false,
        });
    };

    const handleShow = () => setShow(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setNewStep({
            ...newStep,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSave = async () => {
        try {
            await axios.post(`http://localhost:3000/api/flows/steps/${id}`, newStep);

            Swal.fire({
                icon: "success",
                title: "Paso Creado",
                text: "El paso se creó exitosamente.",
            });

            handleClose();
            onStepAdded(); // Notificar que se ha agregado un nuevo paso
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
                className="d-flex align-items-center gap-2 shadow"
            >
                Agregar Paso
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <Modal.Title style={{ fontWeight: '600' }}>Crear Nuevo Paso</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem', backgroundColor: '#fefefe' }}>
                    <div className="mb-3">
                        <label htmlFor="tipo" className="form-label" style={{ fontWeight: '500' }}>Tipo</label>
                        <select
                            id="tipo"
                            name="tipo"
                            className="form-control"
                            value={newStep.tipo}
                            onChange={handleChange}
                            style={{ borderRadius: '0.5rem', border: '1px solid #ced4da' }}
                        >
                            <option value="entrada_numero">Entrada Número</option>
                            <option value="entrada_texto">Entrada Texto</option>
                            <option value="entrada_imagen">Entrada Imagen</option>
                            <option value="seleccion_lista">Selección Lista</option>
                            <option value="seleccion_botones">Selección Botones</option>
                            <option value="fin">Fin</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="mensaje" className="form-label" style={{ fontWeight: '500' }}>Mensaje</label>
                        <input
                            type="text"
                            id="mensaje"
                            name="mensaje"
                            className="form-control"
                            value={newStep.mensaje}
                            onChange={handleChange}
                            placeholder="Ingrese el mensaje"
                            style={{
                                borderRadius: '0.5rem',
                                border: '1px solid #ced4da',
                                padding: '0.5rem',
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tipo_entrada" className="form-label" style={{ fontWeight: '500' }}>Tipo de Entrada</label>
                        <select
                            id="tipo_entrada"
                            name="tipo_entrada"
                            className="form-control"
                            value={newStep.tipo_entrada}
                            onChange={handleChange}
                            style={{ borderRadius: '0.5rem', border: '1px solid #ced4da' }}
                        >
                            <option value="texto">Texto</option>
                            <option value="numero">Número</option>
                            <option value="imagen">Imagen</option>
                            <option value="telefono">Teléfono</option>
                        </select>
                    </div>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="es_final"
                            name="es_final"
                            className="form-check-input"
                            checked={newStep.es_final}
                            onChange={handleChange}
                        />
                        <label htmlFor="es_final" className="form-check-label">
                            Es Paso Final
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '2px solid #dee2e6', backgroundColor: '#f8f9fa' }}>
                    <Button variant="secondary" onClick={handleClose} style={{ borderRadius: '0.5rem' }}>
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        disabled={newStep.mensaje.trim() === ""}
                        onClick={handleSave}
                        style={{
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1.5rem',
                            fontWeight: '500',
                        }}
                    >
                        Crear Paso
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default NewStepModal;
