import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil } from '@fortawesome/free-solid-svg-icons';
import { useFlows, CreateFlowData, UpdateFlowData } from '../../context/FlowsContext';
import { FlowModalProps } from '../../types/index';
import Swal from "sweetalert2";


const FlowModal = ({ mode, initialData, onClose }: FlowModalProps) => {
    const [show, setShow] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [flow, setFlow] = useState({
        nombre: "",
        activo: true,
        ...initialData
    });

    const { createFlow, updateFlow } = useFlows();

    useEffect(() => {
        if (mode === 'edit') {
            setShow(true);
        }
    }, [mode]);

    const handleClose = () => {
        setShow(false);
        setFlow({ nombre: "", activo: true });
        onClose?.();
    };
    const handleShow = () => setShow(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFlow({
            ...flow,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true); // Activamos el loading
            if (mode === 'create') {
                const createData: CreateFlowData = {
                    nombre: flow.nombre,
                    activo: flow.activo
                };
                await createFlow(createData);
                Swal.fire({
                    icon: "success",
                    title: "Flujo Creado",
                    text: "El flujo se creó exitosamente.",
                });
            } else {
                if (initialData?.id) {
                    const updateData: UpdateFlowData = {
                        nombre: flow.nombre,
                        activo: flow.activo
                    };
                    await updateFlow(initialData.id, updateData);
                    Swal.fire({
                        icon: "success",
                        title: "Flujo Actualizado",
                        text: "El flujo se actualizó exitosamente.",
                    });
                }
            }
            handleClose();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
            });
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <>
            {(mode === 'create' || !initialData) && (
                <Button
                    variant={mode === 'create' ? "success" : "warning"}
                    onClick={handleShow}
                    className="d-flex align-items-center gap-2"
                    size={mode === 'create' ? undefined : "sm"}
                >
                    <FontAwesomeIcon icon={mode === 'create' ? faPlus : faPencil} />
                    {mode === 'create' ? 'Agregar Flujo' : 'Editar'}
                </Button>
            )}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {mode === 'create' ? 'Nuevo Flujo' : 'Editar Flujo'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={flow.nombre}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {mode === 'edit' &&
                            <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                <Form.Switch
                                    id="custom-switch"
                                    name="activo"
                                    checked={flow.activo}
                                    onChange={handleChange}
                                    label={flow.activo ? "Activo" : "Inactivo"}
                                    className="custom-switch"
                                />
                            </Form.Group>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        disabled={flow.nombre.trim() === "" || isSaving}
                        onClick={handleSave}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {mode === 'create' ? 'Creando...' : 'Guardando...'}
                            </>
                        ) : (
                            mode === 'create' ? 'Crear Flujo' : 'Guardar Cambios'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FlowModal;