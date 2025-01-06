import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Step, NewStepModalProps } from '../../types/index';
import { StepBuilder } from './StepBuilder';
const NewStepModal = ({ show, onHide, onSave, currentStep, setCurrentStep, addStep,newOpcion }: NewStepModalProps) => {

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <Modal.Title style={{ fontWeight: '600' }}>Crear Nuevo Paso</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '2rem', backgroundColor: '#fefefe' }}>
                <StepBuilder
                    step={currentStep}
                    onStepChange={setCurrentStep}
                    newOpcion={newOpcion}
                />
            </Modal.Body>
            <Modal.Footer style={{ borderTop: '2px solid #dee2e6', backgroundColor: '#f8f9fa' }}>
                <Button variant="secondary" onClick={onHide} style={{ borderRadius: '0.5rem' }}>
                    Cerrar
                </Button>
                <Button
                    variant="primary"
                    onClick={addStep}
                >
                    Agregar Paso Principal
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewStepModal;